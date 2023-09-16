import {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from "axios";

export class HTTPException extends AxiosError {
    constructor(error) {
        const response = error.response;
        super(
            response.statusText,
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
        return `${this.statusText()}: ${this.data().detail}`;
    }
}