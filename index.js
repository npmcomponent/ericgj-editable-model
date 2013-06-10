var Emitter = require('emitter')
  , K       = require('k')

module.exports = EditableRec;

function EditableRec(el, model){
  if (!(this instanceof EditableRec)) return new EditableRec(el,model);
  this.model = model;
  this.editables = [];
  this.doneKeys = "enter";
  this.cancelKeys = "esc";
  if (el) this.init(el);
  this.keys = K(el);
  return this;
}

EditableRec.prototype = new Emitter;

EditableRec.prototype.editing = function(){
  return this._editing;
}

EditableRec.prototype.edit = function(){
  if (this._editing) return this;
  this._keybind();
  this._editing = true;
  for (var i=0;i<this.editables.length;++i) this.editables[i].edit();
  this.emit('edit', this.model);
  return this;
}

EditableRec.prototype.done = function(){
  if (!this._editing) return this;
  for (var i=0;i<this.editables.length;++i) this.editables[i].done();
  this.emit('done', this.model);
  if (this.model.save){
    if (this.model.dirty){ this.model.dirty() && this.model.save(); }
    else                 { this.model.save(); }
  }
  this._editing = false;
  this._keyunbind();
  return this;
}

EditableRec.prototype.cancel = function(){
  if (!this._editing) return this;
  for (var i=0;i<this.editables.length;++i) this.editables[i].cancel();
  this.emit('cancel', this.model);
  this._editing = false;
  this._keyunbind();
  return this;
}

EditableRec.prototype.addEditable = function(el,attr){
  this.editables.push(new EditableAttr(el,this,attr));
  return this;
}
  
EditableRec.prototype.init = function(el){
  el = (typeof el == "string" ? document.querySelector(el) : el);
  var eds = el.querySelectorAll('.editable');
  for (var i=0; i<eds.length; ++i){
    var ed = eds[i],
        attr = data(ed)["model-attr"];
    if (attr) this.addEditable(ed,attr);
  }
  return this;
}

EditableRec.prototype._keybind = function(){
  if (this.doneKeys)   this.keys.bind(this.doneKeys, this.done.bind(this));
  if (this.cancelKeys) this.keys.bind(this.cancelKeys, this.cancel.bind(this));
}

EditableRec.prototype._keyunbind = function(){
  if (this.doneKeys)   this.keys.unbind(this.doneKeys);
  if (this.cancelkeys) this.keys.unbind(this.cancelKeys);
}



function EditableAttr(el,rec,attr){
  this.el = el;
  this.attr = rec.model[attr].bind(rec.model);
}

EditableAttr.prototype.edit = function(){
  this.el.innerHTML = this.attr();
  this.el.setAttribute('contentEditable', true);
}

EditableAttr.prototype.done = function(){
  this.el.removeAttribute('contentEditable');
  this.el.blur();
  var newval = this.el.innerText || null, oldval = this.attr() || null;
  if (oldval !== newval){
    this.attr(newval);
  }
}

EditableAttr.prototype.cancel = function(){
  this.el.innerHTML = this.attr();
  this.done();
}

// private 

var data = function(el){
  var ret = {};
  for (var i=0; i<el.attributes.length; ++i){
    var attr = el.attributes[i]
      , key = attr.name
      , parts = key.split('-')
      , prefix = parts.shift()
      , rest = parts.join('-');
    if (prefix == "data" && rest.length > 0){
      ret[rest] = attr.value;
    }
  }
  return ret;
}

