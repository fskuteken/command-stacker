export type Command = {
  run: () => void
  undo: () => void
}

export type CommandStackerOptions = {
  capacity?: number
}

/**
 * A class that stacks commands to manage undo and redo operations.
 */
export default class CommandStacker {
  undoStack: Command[]

  redoStack: Command[]

  capacity: number

  /**
   * Initializes a new instance of the CommandStacker class
   * @param options The CommandStacker options
   */
  constructor (options: CommandStackerOptions = {}) {
    this.undoStack = []
    this.redoStack = []

    this.capacity = options.capacity || 100
  }

  /**
   * Runs a command and adds it to the undoStack
   * @param command The command to run
   * @returns The command that ran
   */
  run (command: Command): Command {
    command.run()

    this.undoStack.push(command)

    this.redoStack.splice(0, this.redoStack.length)

    if (this.undoStack.length > this.capacity) {
      this.undoStack.splice(this.undoStack.length - 2, 1)
    }

    return command
  }

  /**
   * Undoes the last command, if any
   * @returns The undone command or undefined
   */
  undo (): Command | undefined {
    var command = this.undoStack.pop()

    if (command) {
      command.undo()

      this.redoStack.push(command)

      return command
    }
  }

  /**
   * Redoes the last undone command, if any
   * @returns The redone command or undefined
   */
  redo (): Command | undefined {
    var command = this.redoStack.pop()

    if (command) {
      command.run()

      this.undoStack.push(command)

      return command
    }
  }

  clear () {
    this.undoStack.splice(0, this.undoStack.length)
    this.redoStack.splice(0, this.redoStack.length)
  }
}
