import {Request, Response} from 'express';
import {campaignViewerFunctions} from '@routes/view/campaigns/functions/functions';

export const campaignController = {
  create: (req: Request, res: Response) => {
    return campaignViewerFunctions.createCampaign(req, res);
  },
  join: (req: Request, res: Response) => {
    return campaignViewerFunctions.joinCampaign(req, res);
  },
  leave: (req: Request, res: Response) => {
    return campaignViewerFunctions.leaveCampaign(req, res);
  },
  list: (req: Request, res: Response) => {
    return campaignViewerFunctions.getCampaignListByUserId(req, res);
  }
};

