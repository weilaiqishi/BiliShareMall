export namespace app {
	
	export class C2CItemVO {
	    c2cItemsId: number;
	    c2cItemsName: string;
	    totalItemsCount: number;
	    price: number;
	    showPrice: string;
	
	    static createFrom(source: any = {}) {
	        return new C2CItemVO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.c2cItemsId = source["c2cItemsId"];
	        this.c2cItemsName = source["c2cItemsName"];
	        this.totalItemsCount = source["totalItemsCount"];
	        this.price = source["price"];
	        this.showPrice = source["showPrice"];
	    }
	}
	export class C2CItemListVO {
	    items: C2CItemVO[];
	    total: number;
	    totalPages: number;
	    currentPage: number;
	
	    static createFrom(source: any = {}) {
	        return new C2CItemListVO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.items = this.convertValues(source["items"], C2CItemVO);
	        this.total = source["total"];
	        this.totalPages = source["totalPages"];
	        this.currentPage = source["currentPage"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
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
	export class SearchV2Data {
	    itemCount: number;
	    ticketCount: number;
	
	    static createFrom(source: any = {}) {
	        return new SearchV2Data(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.itemCount = source["itemCount"];
	        this.ticketCount = source["ticketCount"];
	    }
	}
	export class SearchV2Response {
	    code: number;
	    message: string;
	    ttl: number;
	    data: SearchV2Data;
	
	    static createFrom(source: any = {}) {
	        return new SearchV2Response(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.code = source["code"];
	        this.message = source["message"];
	        this.ttl = source["ttl"];
	        this.data = this.convertValues(source["data"], SearchV2Data);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class VerifyLoginResponse {
	    cookies: string;
	
	    static createFrom(source: any = {}) {
	        return new VerifyLoginResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.cookies = source["cookies"];
	    }
	}

}

export namespace dao {
	
	export class ScrapyItem {
	    id: number;
	    priceRange: number[];
	    rateRange: number[];
	    product: string;
	    productName: string;
	    nums: number;
	    order: string;
	    increaseNumber: number;
	    nextToken?: string;
	    // Go type: time
	    createTime: any;
	
	    static createFrom(source: any = {}) {
	        return new ScrapyItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.priceRange = source["priceRange"];
	        this.rateRange = source["rateRange"];
	        this.product = source["product"];
	        this.productName = source["productName"];
	        this.nums = source["nums"];
	        this.order = source["order"];
	        this.increaseNumber = source["increaseNumber"];
	        this.nextToken = source["nextToken"];
	        this.createTime = this.convertValues(source["createTime"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

