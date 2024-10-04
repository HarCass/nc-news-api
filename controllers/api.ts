import { FastifyReply, FastifyRequest } from "fastify";
import { default as currentEndpoints} from "../endpoints.json";

export const getEndpoints = async (_req: FastifyRequest, rep: FastifyReply) => {
    rep.send({endpoints: currentEndpoints});
}