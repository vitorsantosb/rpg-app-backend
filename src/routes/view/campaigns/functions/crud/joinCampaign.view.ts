import {Request, Response} from 'express';
import GetApiUrl from '@services/url.service';

export const joinCampaign = async (req: Request, res: Response) => {
  const { campaignId } = req.params;
  
  // TODO: Implementar lógica para entrar em uma campanha
  return res.status(501).send({
    message: 'Not implemented yet',
    statusCode: 501,
    request: {
      method: 'POST',
      description: 'Join a campaign',
      url: `${GetApiUrl()}/campaign/${campaignId}/join`
    }
  });
}

