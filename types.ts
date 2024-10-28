export interface CompanyInfo {
	ruc: string;
	name: string;
	taxPayerType: string;
	businessName: string | null;
	registrationDate: Date | null;
	startDateOfActivities: Date | null;
	status: string;
	condition: string;
	fiscalAddress: string;
	economicActivities: string[];
}

export interface CompanyLegalRepresentative {
	document: {
		type: string;
		number: string;
	};
	names: string;
	role: string;
	since: Date | null;
}
