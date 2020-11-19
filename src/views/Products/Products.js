// Library
import React, { Component} from 'react';
import * as ProductAPI from '../../api/product'

// Component
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import HeaderModules from 'components/Header/HeaderModules';
import LogoBloc from 'components/LogoBloc/LogoBloc';
import Sidebar from 'components/Sidebar/Sidebar';
import SideRight from 'components/SideRight/SideRight';
import SideLeft from 'views/Products/Components/SideLeft/SideLeft';
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit'
import { Link } from 'react-router-dom';
import { Row, Col, Column } from 'react-bootstrap';
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton'

// Icons
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import AddBoxIcon from '@material-ui/icons/AddBox';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import SearchIcon from '@material-ui/icons/Search';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import WarningIcon from '@material-ui/icons/Warning';


class Products extends Component {

	state = {
		// Content
		products: [],
		showInformation: false,
		currentProduct: {},
		taxations: [],

		// UI
		isLoading: true,
		changingProduct: false,
		value: 0,
	}

	componentDidMount() {
		document.body.classList.add('collapsed-menu');
		// fetching the list of all products
		ProductAPI.list()
			.then(res => {
				var i
				for (i of res.data.results) {
					i.actions = <Row>
						<IconButton size='small' aria-label="see" ><VisibilityOutlinedIcon /></IconButton>
						<IconButton size='small' aria-label="modify" ><CreateOutlinedIcon color='primary' /></IconButton>
						<IconButton size='small' aria-label="delete" ><DeleteIcon color='secondary' /></IconButton>
					</Row>
				}
				this.setState({ products: res.data.results, isLoading: false });
			})
			.catch(err => console.log(err))
	}

	handleInformation = () => {
		this.setState({showInformation: !this.state.showInformation});
	}

	handleChange = (newValue) => {
		this.setState({
			value: newValue,
		})
	}

	render() {
		const BREADCRUMB_LINK = [
			{ position: 0, name: 'KSM', link: 'dashboard' },
			{ position: 1, name: 'Products', link: 'products' },
		];

		const columns = [
			{
				dataField: 'code',
				text: 'Code',
				sort: true,
			},
			{
				dataField: 'name',
				text: 'Nom',
				sort: true,
			},
			{
				dataField: 'category',
				text: 'Catégorie',
				sort: true,
			},
			{
				dataField: 'user',
				text: 'Auteur',
				sort: true,
			},
			{
				dataField: 'actions',
				text: 'Actions',
			}
		]

		const customTotal = (from, to, size) => (
			<span className="react-bootstrap-table-pagination-total">
			  Produits { from } à { to } sur { size }
			</span>
		);
		  
		const options = {
			paginationSize: 10,
			pageStartIndex: 0,
			firstPageText: 'First',
			prePageText: 'Back',
			nextPageText: 'Next',
			lastPageText: 'Last',
			nextPageTitle: 'First page',
			prePageTitle: 'Pre page',
			firstPageTitle: 'Next page',
			lastPageTitle: 'Last page',
			showTotal: true,
			paginationTotalRenderer: customTotal,
			disablePageTitle: true,
			sizePerPageList: [
				{ text: '10', value: 10 },
				{ text: '20', value: 20 },
				{ text: '30', value: 30 },
				{ text: 'All', value: this.state.products.length },
			]
		};

		const rowEvents = {
			onClick: (e, row, rowIndex) => {
				
				this.setState({
					showInformation: true,
					currentProduct: row,
					changingProduct: true,
				});
				this.forceUpdate();
				
			},
		};

		const { SearchBar } = Search



		return (

			<>
				<Sidebar />
				<HeaderModules modules='Products' agency='Fokou Melen' />

				<div className="sl-mainpanel">

					<div>
						
						{/* <Breadcrumb agency='' routes={BREADCRUMB_LINK} activePage="Products" /> */}
						<nav className="breadcrumb sl-breadcrumb">
							<Tabs
								value={this.state.value}
								onChange={this.handleChange}
							>
								<Tab style={{ fontSize: 11}} label='Produits'/>
								<Tab style={{ fontSize: 11}} label='Taxes' />
								<Tab style={{ fontSize: 11}} label='Langues' />
								<Tab style={{ fontSize: 11}} label="Conditionnement" />
							</Tabs>
						</nav>
						
							<Row className="vertical-fill flex-md-fill">
								<Col md={9} className="pd-20  pd-sm-40">
										<ToolkitProvider
											keyField='code'
											data={ this.state.products }
											columns={columns}
											hover
											responsive
											search
										>
											{
												props => (
													<Col>
														<Row className="justify-content-center">
															<SearchBar
																className="search-bar" {...props.searchProps}
																placeholder='Recherche des produits (code, nom, catégorie, auteur)' 
													
															/>
														</Row>
														<Row className="justify-content-end pd-b-10 pd-r-20 pd-t-10">
															<Button
																startIcon={<AddBoxIcon />}
																color='action'
															>
																Ajouter
															</Button>
															<Button
																startIcon={<SaveAltIcon />}
																color='primary'
															>
																Exporter
															</Button>
															<Button
																startIcon={<DeleteIcon />}
																color='secondary'
															>
																Supprimer
															</Button>
														</Row>
														<BootstrapTable
															{...props.baseProps}
															pagination={ paginationFactory() }
															noDataIndication={ this.state.isLoading ? <Row className="justify-content-center"><CircularProgress /></Row> : <Row className="justify-content-center"><p>Liste Vide!</p><WarningIcon color='secondary' /></Row> }
															loading={this.state.isLoading}
															selectRow={{ mode: "checkbox"}}
															rowEvents={rowEvents}
															responsive
															hover
															cellEdit={true}
															bordered={false}
															stripped
														/>
													</Col>
												)
											}	
										</ToolkitProvider>

								</Col>
										
								<Col md={3}  className="side-right pd-20">
									<div className="side-left-card bg-pink pd-20 mg-b-20">
										<h3 className="tx-white">Rayonnage</h3>
										<ul>
											<li className="tx-white h5">Etagère: 2</li>
											<li className="tx-white h5">Rayon: 5</li>
										</ul>
									</div>
									<div className="side-left-card bg-gray-400 pd-20 mg-b-20">
										<h3 className="tx-white">Affichage</h3>
									</div>
									<div className="side-left-card bg-grandeur pd-20 mg-b-20">
										<h3 className="tx-white">Gestion des prix</h3>
									</div>
									<div className="side-left-card bg-gray-400 pd-20 mg-b-20">
										<h3 className="tx-white">Conditionnement</h3>
									</div>
								</Col>
										
							</Row>

					</div>
				</div>
			</>
		);
	}
}

export default Products;
