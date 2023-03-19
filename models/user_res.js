class UserRes {
  constructor(user) {
    this._id = user._id;
    this.email = user.email;
    this.username = user.username;
    this.imageUrl = user.imageUrl;
    this.token = user.token;
    this.files = user.files;
    this.isMedia = user.isMedia;
  }
}

export default UserRes;
