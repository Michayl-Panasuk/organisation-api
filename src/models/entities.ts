export class NewClient {
  private: boolean;
  phone: string;
  address: string;
  fio: string;
  fax?: string;

  constructor(data: NewClient) {
    Object.assign(this, data);
  }
}

export class Client extends NewClient {
  id: number;
}

export class NewTypography {
  name: string;
  phone: string;
  address: string;
  contactPerson: string;
  constructor(data: NewTypography) {
    Object.assign(this, data);
  }
}

export class Typography extends NewTypography {
  id: number;
}

export class NewEdition {
  name: string;
  code: string;
  author: string;
  size: number;
  quantity: string;
  constructor(data: NewEdition) {
    Object.assign(this, data);
  }
}

export class Edition extends NewEdition {
  number: number;
}

export class NewPrintOrder {
  clientId: number;
  typographyId: number;
  editionNumber: number;
  editionType: number;
  completed = false;
  responsible: string;
  createdAt?: string;
  completedAt?: string;
  constructor(data: NewPrintOrder) {
    Object.assign(this, data);
  }
}

export class PrintOrder extends NewPrintOrder {
  number: number;
}

