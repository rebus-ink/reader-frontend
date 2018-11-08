export const machine = {
  id: 'import',
  initial: 'unloaded',
  states: {
    unloaded: {
      on: {
        LOAD: {
          target: 'loading',
          actions: ['load']
        },
        ERROR: {
          target: 'failure',
          actions: ['handleError']
        }
      }
    },
    loading: {
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
        READY: 'import'
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
    import: {
      initial: 'previewing',
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
        previewing: {
          onEntry: ['preview'],
          on: {
            UPLOAD: 'uploading'
          }
        },
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
