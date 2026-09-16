
export interface IMembership extends Document {
    customerId: Types.ObjectId;
    shopId: Types.ObjectId;
    status: MembershipRequestStatus;
    requestDate: Date;
    actionDate?: Date;
    statusReason?: string;
}