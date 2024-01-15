import { RequestHandler } from "express";
import { default as currentEndpoints} from "../endpoints.json"

export const getEndpoints: RequestHandler = (_req, res) => {
    res.status(200).send({endpoints: currentEndpoints});
}