"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const makePublicID = (url, directory) => {
    //const url = "https://res.cloudinary.com/dwok2hmb7/image/upload/v1730821531/Golf/user/y3kfaewg0a66nwg4viec.png";
    //const public_id = 'Coffee/user/dv0gzznxtitu32xbwm6o';
    //if it is not cloudinary url
    const parsed = new URL(url);
    if (!parsed.hostname.includes("cloudinary.com")) {
        return "";
    }
    // Split the URL by slashes(/)
    const parts = url.split("/");
    //split the lart parts by dot(.)
    const lastPart = (parts[parts.length - 1])?.split('.')[0];
    const public_id = `Coffee/${directory}/${lastPart}`;
    return public_id;
};
exports.default = makePublicID;
