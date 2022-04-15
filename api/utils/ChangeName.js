function ChangeName(length) {
    let result = []
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < length; i++) {
        result.push(
            characters.charAt(Math.floor(Math.random() * characters.length))
        );
    }
    return result.join("");

}
module.exports = {
    ChangeName
}