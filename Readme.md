*This repository is a mirror of the [component](http://component.io) module [ericgj/editable-model](http://github.com/ericgj/editable-model). It has been modified to work with NPM+Browserify. You can install it using the command `npm install npmcomponent/ericgj-editable-model`. Please do not open issues or send pull requests against this repo. If you have issues with this repo, report it to [npmcomponent](https://github.com/airportyh/npmcomponent).*

# editable-model

  Simple in-place editing integrated with component/model

  <img src="http://i.imgur.com/9r6aXf0.png" title="Example" />

## Installation

    $ component install ericgj/editable-model

## Example

See [test/index.html](/test/index.html).

## API

### EditableRec([el],model) 
   
Construct the editable component bound to the given model instance.

If `el` given, all child elements with class `editable` are automatically bound
to the model attribute matching their `data-model-attr` element attribute,
and edited using 'contenteditable'. Also, keyboard event bindings are scoped
to the given `el`. Note this behavior may change (see TODO below).

### EditableRec#edit()

Enter 'edit' mode. All associated editable components are made editable.

### EditableRec#done()

Exit 'edit' mode, saving the model changes, if model is dirty.

### EditableRec#cancel()

Exit 'edit' mode, reverting any changes to the model.

### EditableRec#editing()

True if in 'edit' mode, false otherwise.

### EditableRec#addEditable(el,attr)

Bind the given element to the given attribute of the model.

### EditableRec#doneKeys=

Keydown bindings for triggering done() while in edit mode. By default, "enter".
See [yields/k](https://github.com/yields/k) for syntax for keys.

### EditableRec#cancelKeys=

Keydown bindings for triggering cancel() while in edit mode. By default, "esc".

## Events

- `edit model`
- `done model`
- `cancel model`

## Notes

No assumptions are made about how users enter edit mode. It's up to the 
calling context to trigger `edit()` from an event callback.

By default, exiting edit mode is triggered through "enter" (`done`) and "esc" 
(`cancel`) keydowns within a parent element. These can be disabled by setting 
`doneKeys =  null` and `cancelKeys = null`, or changed to other key 
combinations. And of course external events can be wired up to trigger `done` 
and `cancel`.


## TODO

Custom editable behavior. Right now editing is done via 'contenteditable',
but this is too uncontrolled for many situations. Should be possible to
specify custom editable classes to use instead.


## License

  MIT
