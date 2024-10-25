export namespace app {
	
	export class LoginInfo {
	    key: string;
	    login_url: string;
	
	    static createFrom(source: any = {}) {
	        return new LoginInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.key = source["key"];
	        this.login_url = source["login_url"];
	    }
	}
	export class VerifyLoginResponse {
	    cookies: {[key: string]: string};
	
	    static createFrom(source: any = {}) {
	        return new VerifyLoginResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.cookies = source["cookies"];
	    }
	}

}

