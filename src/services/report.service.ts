import { Injectable } from '@angular/core';

@Injectable()
export class ReportService {
    private image: string = null;

    constructor() { }
/**
    *   Set private local variable "image", to hold the recieved image (as string)
    *   @returns {Boolean}
    */
    setImage(stringifiedImage) {
        this.image = stringifiedImage;

        return this.image == stringifiedImage;
    }

    /**
    *   Return the local variable image (as string)
    *   @returns {String}
    */
    getImage() {
        return this.image;
    }
}