export type DashboardBreakdownItem = {
	label: string;
	count: number;
};

export type DashboardTopTool = {
	id: string;
	nome: string;
	usoEmProcessos: number;
};

export type DashboardSummary = {
	totais: {
		areas: number;
		processos: number;
		subprocessos: number;
		ferramentas: number;
		responsaveis: number;
		documentos: number;
	};
	distribuicao: {
		porStatus: DashboardBreakdownItem[];
		porTipo: DashboardBreakdownItem[];
		porImportancia: DashboardBreakdownItem[];
	};
	pendencias: {
		processosSemDocumentos: number;
		processosSemResponsaveis: number;
	};
	topFerramentas: DashboardTopTool[];
};
