import { h } from 'hyperapp'
import { handleSignIn } from '../lib/fire'

export const SignIn = () => (
  <div class="center">
    <p>Save your portfolio</p>
    <button class="btn btn-primary" onclick={handleSignIn}>
      Sign in with Google
    </button>
  </div>
)
