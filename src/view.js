import { h } from 'hyperapp'
import { SignIn } from './components/SignIn'
import { Portfolio } from './components/Portfolio'
import { TopList } from './components/TopList'
import { handleSignOut } from './lib/fire'

export const View = (state, actions) => (
  <div class="flex flex-column">
    <header class="hero">
      <div class="stars" />
      <div class="p2">
        <h1 class="h1 m0 center text-shadow">Moon Market Cap</h1>
      </div>
      <div class="relative">
        <img class="moon" src="/images/moon.svg" alt="" />
        <img class="flag" src="/images/flag.svg" alt="" />
      </div>
    </header>
    <main>
      <section class="mx-auto max-width p1 mb2">
        {state.user ? (
          <Portfolio state={state} actions={actions} />
        ) : (
          <SignIn />
        )}
        <TopList state={state} actions={actions} />
      </section>
    </main>
    <footer class="right-align ">
      {!!state.user && (
        <button class="btn" onclick={handleSignOut}>
          Sign out
        </button>
      )}
    </footer>
  </div>
)
