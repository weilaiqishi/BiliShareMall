declare namespace LoginAPI {
  interface GetLoginQRCodeRequest {
    userAgent: string;
  }

  interface GetLoginQRCodeResponse {
    code: number;
    message: string;
    data: {
      key: string;
      url: string;
    };
  }

  interface VerifyLoginStatusRequest {
    key: string;
    userAgent: string;
  }

  interface VerifyLoginStatusResponse {
    code: number;
    message: string;
    data: {
      status: number;
      cookie: string;
    };
  }
}