const FIREBASE_CONFIG = {}

firebase.initializeApp(FIREBASE_CONFIG);


const isSignIn = () => {
  if(location.pathname.includes('resignin')) return false
  if(location.pathname.includes("signin") || location.pathname.includes('deleted') || location.pathname.includes("signup") || location.pathname.includes("reset") || location.pathname.includes('user') || location.pathname.includes('game') || location.pathname.includes("disconnected")) return true
}


firebase.auth().onAuthStateChanged(async user => {
  console.log('auth state changed')
  if (user) {
    if(document.cookie.length <= 0) await user.signOut()
    console.log('user')
    const remember = localStorage.getItem('remember') || false
    document.cookie = `token=${await user.getIdToken()}; expires=${remember ? new Date('9/9/9999').toUTCString() : new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30).toUTCString()}; path=/;`
    currentUser = user
  }else{
    document.cookie = `token=; expires=${new Date(0).toUTCString()}; path=/;`
    if(!isSignIn()) {
    location = '/signin'
    }
  }
});

if(!localStorage.getItem('me')){
fetch('/me/json').then(async u_ => {
  const u = await u_.json()
  localStorage.setItem('me', JSON.stringify({
    photoURL: u.photoURL,
    uid: u.uid,
    displayName: u.displayName,
  }))
  
})
  
}