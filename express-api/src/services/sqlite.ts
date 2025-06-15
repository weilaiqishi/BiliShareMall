import Database from 'better-sqlite3';
import path from 'path';

import { SearchCategoryRequestBody, SearchCategoryResponse, SearchCategoryGoodsItem } from '../../../types/search_category_request';

const dbPath = path.join(__dirname, '../../../data/bsm.db');
let db: Database.Database;

export function initializeDatabase() {
    try {
        db = new Database(dbPath, { verbose: console.log });
        console.log('Connected to the SQLite database.');

        // Create tables if they don't exist
        db.exec(`
            CREATE TABLE IF NOT EXISTS scrapy_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                price_range TEXT,
                rate_range TEXT,
                product TEXT,
                product_name TEXT,
                nums INTEGER,
                increase_number INTEGER,
                next_token TEXT,
                create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                'order' TEXT
            );

            CREATE TABLE IF NOT EXISTS c2c_items (
                c2c_items_id INTEGER PRIMARY KEY UNIQUE,
                type INTEGER,
                c2c_items_name TEXT,
                total_items_count INTEGER,
                price INTEGER,
                show_price TEXT,
                show_market_price TEXT,
                uid TEXT,
                payment_time INTEGER,
                is_my_publish BOOLEAN,
                uface TEXT,
                uname TEXT
            );

            CREATE TABLE IF NOT EXISTS search_goods_items (
                itemsId INTEGER PRIMARY KEY UNIQUE,
                bizType TEXT,
                itemsType INTEGER,
                name TEXT,
                price TEXT,
                itemsImg TEXT,
                actMaterial TEXT,
                selfSold BOOLEAN,
                tag TEXT,
                marketingTag TEXT,
                recommendTag TEXT,
                soldOut TEXT,
                like INTEGER,
                brief TEXT,
                properties TEXT,
                preDepositPrice TEXT,
                maxPreDepositPrice TEXT,
                saleType INTEGER,
                payType INTEGER,
                coin TEXT,
                pricePrefix TEXT,
                priceSymbol TEXT,
                priceDesc TEXT,
                extraInfo TEXT,
                ipRightName TEXT,
                ipRightId INTEGER,
                brandName TEXT,
                brandId INTEGER,
                presaleDeliveryTimeStr TEXT,
                preSale TEXT,
                remain TEXT,
                presaleStartOrderTime TEXT,
                tags TEXT,
                feedTag TEXT,
                tagPrefix TEXT,
                preDepositVO TEXT,
                advState TEXT,
                subSkuList TEXT,
                atmosList TEXT,
                jumpUrl TEXT,
                jumpUrlH5 TEXT,
                jumpLinkType INTEGER,
                themeId INTEGER,
                pubtime INTEGER,
                blindRotation TEXT,
                living BOOLEAN,
                merchantInfo TEXT,
                itemAttrs TEXT,
                bannerText TEXT,
                type TEXT,
                interest TEXT,
                imageList TEXT,
                topSubSku TEXT,
                isNewCustom BOOLEAN,
                blindCardUrl TEXT,
                create_time DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('SQLite tables checked/created.');
    } catch (error) {
        console.error('Error connecting to SQLite or creating tables:', error);
        throw error;
    }
}

export function insertScrapyItem(item: any) {
    const stmt = db.prepare(`
        INSERT INTO scrapy_items (
            price_range, rate_range, product, product_name, nums, 
            increase_number, next_token, 'order'
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
        JSON.stringify(item.priceRange),
        JSON.stringify(item.rateRange),
        item.product,
        item.productName,
        item.nums,
        item.increaseNumber,
        item.nextToken,
        item.order
    );
    return info.lastInsertRowid;
}

export function getScrapyItems() {
    const stmt = db.prepare('SELECT * FROM scrapy_items');
    return stmt.all();
}

export function insertC2CItem(item: any) {
    const stmt = db.prepare(`
        INSERT OR IGNORE INTO c2c_items (
            c2c_items_id, type, c2c_items_name, total_items_count, price,
            show_price, show_market_price, uid, payment_time, is_my_publish,
            uface, uname
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
        item.c2cItemsId,
        item.type,
        item.c2cItemsName,
        item.totalItemsCount,
        item.price,
        item.showPrice,
        item.showMarketPrice,
        item.uid,
        item.paymentTime,
        item.isMyPublish,
        item.uface,
        item.uname
    );
    return info.changes;
}

export function getC2CItems() {
    const stmt = db.prepare('SELECT * FROM c2c_items');
    return stmt.all();
}

export function insertSearchGoodsItems(items: SearchCategoryGoodsItem[]) {
    const keys = [
        'itemsId', 'bizType', 'itemsType', 'name', 'price', 'itemsImg', 'actMaterial',
        'selfSold', 'tag', 'marketingTag', 'recommendTag', 'soldOut', 'like', 'brief',
        'properties', 'preDepositPrice', 'maxPreDepositPrice', 'saleType', 'payType',
        'coin', 'pricePrefix', 'priceSymbol', 'priceDesc', 'extraInfo', 'ipRightName',
        'ipRightId', 'brandName', 'brandId', 'presaleDeliveryTimeStr', 'preSale',
        'remain', 'presaleStartOrderTime', 'tags', 'feedTag', 'tagPrefix', 'preDepositVO',
        'advState', 'subSkuList', 'atmosList', 'jumpUrl', 'jumpUrlH5', 'jumpLinkType',
        'themeId', 'pubtime', 'blindRotation', 'living', 'merchantInfo', 'itemAttrs',
        'bannerText', 'type', 'interest', 'imageList', 'topSubSku', 'isNewCustom', 'blindCardUrl', 'create_time'
    ]
    console.log('insertSearchGoodsItems', items.length, keys.length)
    const stmt = db.prepare(`
        INSERT OR REPLACE INTO search_goods_items (
            ${keys.join(',')}
        ) VALUES (
            ${keys.map(() => '?').join(',')}
        )
    `);

    for (const item of items) {
        stmt.run(
            item.itemsId,
            item.bizType,
            item.itemsType,
            item.name,
            item.price,
            item.itemsImg,
            JSON.stringify(item.actMaterial),
            item.selfSold ? 1 : 0,
            item.tag,
            item.marketingTag,
            item.recommendTag,
            item.soldOut ? 1 : 0,
            item.like ? 1 : 0,
            item.brief,
            JSON.stringify(item.properties),
            item.preDepositPrice,
            item.maxPreDepositPrice,
            item.saleType,
            item.payType,
            item.coin,
            item.pricePrefix,
            item.priceSymbol,
            item.priceDesc,
            JSON.stringify(item.extraInfo),
            item.ipRightName,
            item.ipRightId,
            item.brandName,
            item.brandId,
            item.presaleDeliveryTimeStr,
            item.preSale ? 1 : 0,
            item.remain,
            item.presaleStartOrderTime,
            JSON.stringify(item.tags),
            JSON.stringify(item.feedTag),
            item.tagPrefix,
            JSON.stringify(item.preDepositVO),
            item.advState,
            JSON.stringify(item.subSkuList),
            JSON.stringify(item.atmosList),
            item.jumpUrl,
            item.jumpUrlH5,
            item.jumpLinkType,
            item.themeId,
            item.pubtime,
            item.blindRotation ? 1 : 0,
            item.living ? 1 : 0,
            JSON.stringify(item.merchantInfo),
            JSON.stringify(item.itemAttrs),
            JSON.stringify(item.bannerText),
            item.type,
            item.interest,
            JSON.stringify(item.imageList),
            JSON.stringify(item.topSubSku),
            item.isNewCustom ? 1 : 0,
            item.blindCardUrl,
            Date.now()
        );
    }
}

export function closeDatabase() {
    if (db) {
        db.close();
        console.log('Closed the SQLite database connection.');
    }
}