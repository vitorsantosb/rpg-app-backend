import {Request, Response} from 'express';
import GetApiUrl from '@services/url.service';
import CampaignRepository from '@repository/campaign.repository';
import {CampaignStatusValues, ICampaign} from '@models/campaign.model';
import {CampaignAdapter} from '../../../../../adapters/campaign.adapter';

export const createCampaign = async (req: Request, res: Response) => {
  const {name, description, maxPlayers} = req.body;
  const userId = (req as any).userId;

  if(!name || !maxPlayers) {
    return res.status(422).send({
      message: 'Missing entities',
      statusCode: 422,
      request: {
        method: 'POST',
        description: 'Failure to create new campaign',
        url: `${GetApiUrl()}/campaign/create`,
      }
    });
  }

  const campaignData: ICampaign = {
    _name: name,
    _master_id: userId,
    _description: description || undefined,
    _maxPlayers: maxPlayers,
    _created_at: new Date(),
    _status: CampaignStatusValues.ACTIVE,
    _players: [],
  }

  const result = await CampaignRepository.Store(campaignData);

  if(result.acknowledged && result.insertedId) {
    // Busca a campanha criada para retornar
    const { GetDatabase } = await import('@database/database');
    const { collections: dbCollections } = await GetDatabase();

    const createdCampaign = await dbCollections.campaigns.findOne({ _id: result.insertedId });

    if(createdCampaign) {
      const campaignResponse = CampaignAdapter.campaignResponse(createdCampaign);
      return res.status(201).send({
        message: 'Successfully created campaign',
        statusCode: 201,
        request: {
          method: 'POST',
          description: 'Successfully created campaign',
          url: `${GetApiUrl()}/campaign/create`,
        },
        campaign: campaignResponse
      });
    }
  }

  return res.status(400).send({
    message: 'Failure',
    statusCode: 400,
    request: {
      method: 'POST',
      description: 'Failure to create new campaign',
      url: `${GetApiUrl()}/campaign/create`,
    }
  });
}

