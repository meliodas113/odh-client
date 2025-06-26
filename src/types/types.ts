export interface Market {
    question: string;
    imageURI: string;
    optionA: string;
    optionB: string;
    endTime: bigint;
    outcome: number;
    totalOptionAShares: bigint;
    totalOptionBShares: bigint;
    resolved: boolean;
    category: string;
  }


  export interface UserPosition{
    marketName:string;
    outcome:string;
    endTime:number;
    shares:number;
    isOpen:boolean;
    outcomeIndex:number;
  }