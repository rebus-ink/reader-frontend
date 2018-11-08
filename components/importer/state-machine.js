export const machine = {
  id: 'import',
  initial: 'unloaded',
  states: {
    unloaded: {
      on: {
        LOAD: {
          target: 'loaded',
          actions: ['load']
        },
        ERROR: {
          target: 'failure',
          actions: ['handleError']
        }
      }
    },
    loaded: {
      initial: ['parsing'],
      on: {
        CANCEL: {
          target: 'unloaded',
          actions: ['unload']
        },
        ERROR: {
          target: 'failure',
          actions: ['handleError']
        },
        READY: 'ready'
      },
      states: {
        parsing: {
          onEntry: ['parse'],
          on: {
            PROCESS: 'processing'
          }
        },
        processing: {
          onEntry: ['process']
        }
      }
    },
    ready: {
      initial: 'uploading',
      on: {
        CANCEL: {
          target: 'unloaded',
          actions: ['unload']
        },
        ERROR: {
          target: 'failure',
          actions: ['handleError']
        },
        DONE: 'success'
      },
      states: {
        uploading: {
          onEntry: ['upload'],
          on: {
            CREATE: 'creating'
          }
        },
        creating: {
          onEntry: ['create']
        }
      }
    },
    success: {
      type: 'final'
    },
    failure: {
      type: 'final'
    }
  }
}

// Actions: load, handleError, unload, parse, process, upload, create
// Interpreter needs to be an event emitter and maybe also an observable.
