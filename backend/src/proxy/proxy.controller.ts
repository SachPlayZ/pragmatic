// src/proxy/proxy.controller.ts
import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import fetch from 'node-fetch';

@Controller('api/proxy')
export class ProxyController {
  @Post()
  async proxy(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    try {
      const rpcRes = await fetch('https://devnet.dplabs-internal.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await rpcRes.text();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization',
      );
      return res.status(200).send(data);
    } catch (err) {
      console.error('Proxy error:', err);
      return res.status(500).json({ error: 'Proxy failed' });
    }
  }
}
