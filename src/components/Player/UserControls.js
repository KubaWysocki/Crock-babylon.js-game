class UserControls {
    constructor() {
        this.isWPressed = false
        this.isSPressed = false
        this.isAPressed = false
        this.isDPressed = false
        this.isBPressed = false
        this.isFPressed = false
        this.isSpacePressed = false

        window.addEventListener( 'keydown', e => {
            switch( e.keyCode ){
                case 87: this.isWPressed = true; break
                case 83: this.isSPressed = true; break
                case 65: this.isAPressed = true; break
                case 68: this.isDPressed = true; break
                case 66: this.isBPressed = true; break
                case 70: this.isFPressed = true; break
                case 32: this.isSpacePressed = true; break
            }
        })
        window.addEventListener( 'keyup', e => {
            switch( e.keyCode ){
                case 87: this.isWPressed = false; break
                case 83: this.isSPressed = false; break
                case 65: this.isAPressed = false; break
                case 68: this.isDPressed = false; break
                case 66: this.isBPressed = false; break
                case 70: this.isFPressed = false; break
                case 32: this.isSpacePressed = false; break
            }
        })
    }
}
export default UserControls