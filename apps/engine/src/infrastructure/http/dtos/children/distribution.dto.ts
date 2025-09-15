import type { AmountDistributionDTO } from './amount-distribution.dto'
import type { RemainingDistributionDTO } from './remaining-distribution.dto'
import type { ShareDistributionDTO } from './share-distribution.dto'

export type DistributionDTO = AmountDistributionDTO | ShareDistributionDTO | RemainingDistributionDTO
