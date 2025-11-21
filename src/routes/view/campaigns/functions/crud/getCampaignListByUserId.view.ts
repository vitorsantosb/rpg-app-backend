import {Request, Response} from 'express';
import GetApiUrl from '@services/url.service';
import CampaignRepository from '@repository/campaign.repository';
import {CampaignAdapter} from '../../../../../adapters/campaign.adapter';

export const getCampaignListByUserId = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  if(!userId) {
    return res.status(401).send({
      message: 'Not Found',
      statusCode: 401,
      request: {
        method: 'GET',
        statusCode: 401,
        url: `${GetApiUrl()}/campaign`,
      }
    });
  }
  const campaignList = await CampaignRepository.GetCampaignByOwnerId(userId);

  console.log(campaignList);

  const campaigns = campaignList.map(campaign => CampaignAdapter.campaignResponse(campaign));

  res.status(200).send({
    message: 'Successfully',
    statusCode: 200,
    request: {
      method: 'GET',
      statusCode: 200,
      url: `${GetApiUrl()}/campaign`,
    },
    campaigns: campaigns,
  });
}

