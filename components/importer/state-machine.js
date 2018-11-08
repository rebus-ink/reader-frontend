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
      initial: ['previewing'],
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
        previewing: {
          onEntry: ['preview'],
          on: {
            PARSE: 'parsing'
          }
        },
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

// Actions: load, handleError, unload, preview, parse, process, upload, create
// Interpreter needs to be an event emitter and maybe also an observable.
// Serverside, all the preview action does is send the PARSE event.
