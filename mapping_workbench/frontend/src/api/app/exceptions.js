import {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from "axios";

export class HTTPException extends AxiosError {
    constructor(error) {
        const response = error.response;
        super(
            response && response.statusText || error.message,
            response && response.status || error.code,
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
        return this.response ? this.renderResponseMessage() : this.renderErrorMessage();
    }

    renderErrorMessage() {
        return `${this.code}: ${this.message}`;
    }

    renderResponseMessage() {
        return `${this.statusText()}: ${this.data().detail}`;
    }
}