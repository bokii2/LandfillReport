export interface INewsArticle {
    id: number;
    title: string;
    url: string;
    source: string;
    scrapedAt: string;
}

export interface INewsArticleLise {
    news: INewsArticle[];
}