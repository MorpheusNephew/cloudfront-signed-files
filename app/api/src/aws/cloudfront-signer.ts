import { Response } from 'express';

export const createSignedUrl = async (fileUrl: string) => {

};

export const createSignedCookies = async (res: Response) => {
    res.cookie('SomeCookie', 'SomeValue');
};
