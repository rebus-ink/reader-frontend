# `<confirm-action>`

#### `confirm-action basic render`

```html
<confirm-action
  dangerous=""
  name="Sign Out"
  question="Are you sure that you want to sign out?"
>
  <strong
    class="Modal-name"
    slot="modal-title"
  >
    Sign Out
  </strong>
  <div slot="modal-body">
    <p class="Modal-paragraph">
      Are you sure that you want to sign out?
    </p>
    <div class="Modal-row">
      <ink-text-button closer="">
        Cancel
      </ink-text-button>
      <ink-button dangerous="">
        Sign Out
      </ink-button>
    </div>
  </div>
</confirm-action>

```

