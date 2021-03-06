# CommandStacker

[![Test](https://github.com/fskuteken/command-stacker/actions/workflows/test.yml/badge.svg)](https://github.com/fskuteken/command-stacker/actions/workflows/test.yml)

A lightweight JavaScript utility library to undo and redo commands.

## Install

```
npm install command-stacker
```

## Usage

```typescript
import CommandStacker from 'command-stacker'

let counter = 0

const incrementCommand = {
  run: () => counter++,
  undo: () => counter--
}

const commandStacker = new CommandStacker()

commandStacker.run(incrementCommand)
// counter = 1

commandStacker.undo()
// counter = 0

commandStacker.redo()
// counter = 1
```

## API

A `Command` is an object implementing the following interface:

```typescript
type Command = {
  run: () => void
  undo: () => void
}
```

The `CommandStacker` class has two arrays representing the commands it manages: `undoStack` and `redoStack`.
It has the following methods:

### `add`

Adds a `Command` to the `undoStack` and clears the `redoStack`.

### `run`

Runs a `Command`, pushes it to the `undoStack` and clears the `redoStack`.

### `undo`

Undoes the last command from `undoStack`, adds it to the `redoStack` and returns it.
If the `undoStack` is empty, `undefined` is returned.

### `redo`

Pops the last command from `redoStack`, adds it to the `undoStack` and returns it.
If the `redoStack` is empty, `undefined` is returned.

### `clear`

Clears all commands from `undoStack` and `redoStack`.

## Generics

It is possible to define your own custom `Command` type and pass it as a generic argument to `CommandStacker`:

```typescript
type CustomCommand = Command & {
  name: string
}

const commandStacker = new CommandStacker<CustomCommand>()

let counter = 0

const incrementCommand = {
  name: 'increment',
  run: counter++,
  undo: counter--
}

commandStacker.run(command)
```
