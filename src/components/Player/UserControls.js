class UserControls {
    constructor() {
        this.isBPressed = false
        this.isFPressed = false

        window.addEventListener( 'keydown', e => {
            switch( e.keyCode ){
                case 66: this.isBPressed = true; break
                case 70: this.isFPressed = true; break
            }
        })
        window.addEventListener( 'keyup', e => {
            switch( e.keyCode ){
                case 66: this.isBPressed = false; break
                case 70: this.isFPressed = false; break
            }
        })
    }
}
export default UserControls