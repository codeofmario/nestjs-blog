import { Controller, Get, Next, Req, Res } from "@nestjs/common";
import { NoAuth } from "@app/common/decorators/public.decorator";
import proxy from "express-http-proxy";
import { ApiExcludeController } from "@nestjs/swagger";

const httpProxy = proxy("http://localhost:8400", {
  proxyReqPathResolver: (req) =>
    req.url.replace("/assets/images/", "/nestjsblog/"),
});

@Controller()
@ApiExcludeController()
export class FileProxyController {
  @NoAuth()
  @Get("/assets/images/*")
  proxy(@Req() req, @Res() res, @Next() next) {
    httpProxy(req, res, next);
  }
}
