import {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from "axios";

export class HTTPException extends AxiosError {
    constructor(error) {
        const response = error.response;
        console.log(error);
        super(
            response && response.statusText || error.message,
            response.status,
            null,
            error.request,
            error.response
        );
        this.response = response
        this.message = this.renderMessage();
    }

    status() {
        return this.response.status;
    }

    statusText() {
        return this.response.statusText;
    }

    data() {
        return this.response.data;
    }

    renderMessage() {
        return this.response ? this.renderResponseMessage() : this.message;
    }

    renderResponseMessage() {
        return `${this.statusText()}: ${this.data().detail}`;
    }
}