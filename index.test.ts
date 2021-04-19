import CommandStacker, { Command } from './index'

const createCommand = (): Command => ({ run: jest.fn(), undo: jest.fn() })

describe('CommandStacker', () => {
  describe('add', () => {
    test('does not run the command', () => {
      const subject = new CommandStacker()
      const command = createCommand()

      subject.add(command)

      expect(command.run).not.toHaveBeenCalled()
    })

    test('stacks the command to undo', () => {
      const subject = new CommandStacker()
      const command = createCommand()

      subject.add(command)

      expect(subject.undoStack).toContain(command)
    })

    test('clears the redo stack', () => {
      const subject = new CommandStacker()
      const command = createCommand()
      subject.redoStack.push(createCommand())

      subject.add(command)

      expect(subject.redoStack.length).toBe(0)
    })

    test('ensures capacity is not exceeded', () => {
      const subject = new CommandStacker({ capacity: 3 })
      const command = createCommand()
      subject.add(createCommand())
      subject.add(createCommand())
      subject.add(createCommand())

      subject.add(command)

      expect(subject.undoStack.length).toBe(3)
    })

    test('returns the command', () => {
      const subject = new CommandStacker()
      const command = createCommand()

      const result = subject.add(command)

      expect(result).toBe(command)
    })
  })

  describe('run', () => {
    test('runs the command', () => {
      const subject = new CommandStacker()
      const command = createCommand()

      subject.run(command)

      expect(command.run).toHaveBeenCalled()
    })

    test('stacks the command to undo', () => {
      const subject = new CommandStacker()
      const command = createCommand()

      subject.run(command)

      expect(subject.undoStack).toContain(command)
    })

    test('clears the redo stack', () => {
      const subject = new CommandStacker()
      const command = createCommand()
      subject.redoStack.push(createCommand())

      subject.run(command)

      expect(subject.redoStack.length).toBe(0)
    })

    test('ensures capacity is not exceeded', () => {
      const subject = new CommandStacker({ capacity: 3 })
      const command = createCommand()
      subject.run(createCommand())
      subject.run(createCommand())
      subject.run(createCommand())

      subject.run(command)

      expect(subject.undoStack.length).toBe(3)
    })

    test('returns the command', () => {
      const subject = new CommandStacker()
      const command = createCommand()

      const result = subject.run(command)

      expect(result).toBe(command)
    })
  })

  describe('undo', () =>  {
    describe('when there is a command to undo', () => {
      test('undoes the last command', () => {
        const subject = new CommandStacker()
        const command = createCommand()
        subject.run(command)

        subject.undo()

        expect(command.undo).toHaveBeenCalled()
      })

      test('removes the command from undo stack', () => {
        const subject = new CommandStacker()
        subject.run(createCommand())
        subject.run(createCommand())

        subject.undo()

        expect(subject.undoStack.length).toBe(1)
      })

      test('stacks the command to redo', () => {
        const subject = new CommandStacker()
        const command = createCommand()
        subject.run(command)

        subject.undo()

        expect(subject.redoStack[0]).toBe(command)
      })

      test('returns the undone command', () => {
        const subject = new CommandStacker()
        const command = createCommand()
        subject.run(command)

        const result = subject.undo()

        expect(result).toBe(command)
      })
    })

    describe('when there is no command to undo', () => {
      test('returns undefined', () => {
        const subject = new CommandStacker()

        const result = subject.undo()

        expect(result).toBeUndefined()
      })
    })
  })

  describe('redo', () =>  {
    describe('when there is a command to redo', () => {
      test('undoes the last command', () => {
        const subject = new CommandStacker()
        const command = createCommand()
        subject.run(command)
        subject.undo()

        subject.redo()

        expect(command.run).toHaveBeenCalledTimes(2)
      })

      test('removes the command from redo stack', () => {
        const subject = new CommandStacker()
        subject.run(createCommand())
        subject.undo()

        subject.redo()

        expect(subject.redoStack.length).toBe(0)
      })

      test('stacks the command to undo', () => {
        const subject = new CommandStacker()
        const command = createCommand()
        subject.run(command)
        subject.undo()

        subject.redo()

        expect(subject.undoStack[0]).toBe(command)
      })

      test('returns the redone command', () => {
        const subject = new CommandStacker()
        const command = createCommand()
        subject.run(command)
        subject.undo()

        const result = subject.redo()

        expect(result).toBe(command)
      })
    })

    describe('when there is no command to redo', () => {
      test('returns undefined', () => {
        const subject = new CommandStacker()

        const result = subject.redo()

        expect(result).toBeUndefined()
      })
    })
  })

  describe('clear', () => {
    test('clears the undo and redo stacks', () => {
      const subject = new CommandStacker()
      subject.run(createCommand())
      subject.run(createCommand())
      subject.run(createCommand())
      subject.undo()

      subject.clear()

      expect(subject.undoStack.length).toBe(0)
      expect(subject.redoStack.length).toBe(0)
    })
  })

  describe('examples', () => {
    describe('counter', () => {
      test('run', () => {
        let counter = 0
        const subject = new CommandStacker()
        const command = {
          run: () => counter++,
          undo: () => counter--
        }

        subject.run(command)

        expect(counter).toBe(1)
      })

      test('undo', () => {
        let counter = 0
        const subject = new CommandStacker()
        const command = {
          run: () => counter++,
          undo: () => counter--
        }
        subject.run(command)

        subject.undo()

        expect(counter).toBe(0)
      })

      test('redo', () => {
        let counter = 0
        const subject = new CommandStacker()
        const command = {
          run: () => counter++,
          undo: () => counter--
        }
        subject.run(command)
        subject.undo()

        subject.redo()

        expect(counter).toBe(1)
      })
    })
  })

  describe('generics', () => {
    test('accepts a generic command type', () => {
      type CustomCommand = Command & { name: string }
      const subject = new CommandStacker<CustomCommand>()
      const command: CustomCommand = {
        name: 'example',
        run: jest.fn(),
        undo: jest.fn()
      }

      const result = subject.run(command)

      expect(result.name).toBe(command.name)
    })
  })
})
