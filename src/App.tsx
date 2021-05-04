import React, {useEffect, useState} from 'react';
import CompanyBlock from './components/CompanyBlock'
import styled from 'styled-components';
import ApiClient from './apiclient/ApiClient';
import {ICompany, IPopup, MainColor, SecondaryColor} from './components/Primitives';
import CompanyInfo from './components/CompanyInfo';
import Navi from './components/Navi';

const MainDiv = styled.div`
  box-sizing: border-box;
  padding: 5% 20%;
`;

const Title = styled.div`
  color: ${MainColor};
  text-align: center;
  font-size: 50px;
  font-weight: bold;
  margin-bottom: 100px;
`;

const StockTable = styled.table`
  width: 100%;
  margin: auto;
  border-collapse: collapse;
  border-style: hidden;
  overflow: visible;
  td {
    border-top: 1px solid black;
    padding: 15px 20px;
    text-align: center;
    cursor: pointer;
  }
  tr{
    margin-bottom: 20px;
  }
  tr:hover{
    background: ${MainColor};
    color: white;
  }
  th{
    color: white;
    background: ${MainColor};
    padding: 20px 20px;
  }

  #symbol, #exchange{
    width: 225px;
  }
`;

const PageWrap = styled.div`
  margin: 5px 0px;

  #current-page{
    background: ${MainColor};
    color: white;
  }
`;

const PageBlock = styled.div`
  font-size: 12px;
  padding: 3px 5px; 
  margin-right: 3px;
  background: ${SecondaryColor};
  display: inline-block;
  text-align: center;
  cursor: pointer;

  :hover{
    background: ${MainColor};
    color: white;
  }
`;

const decodeString = (string: string) => {
  let lines = string.split('\n');
  let res: Array<ICompany> = [];
  lines.slice(1).forEach(line => {
    let tmp = line.split(',');
    if(tmp.length > 2 &&tmp[1].length > 0){
      res.push({
      symbol: tmp[0],
      name: tmp[1],
      exchange: tmp[2],
      ...tmp
    })
    }
    
  });
  return res;
}

const App = () => {
  const [allCompanies, setCompanies] = useState<Array<ICompany>>([]);
  const [currCompanies, setCurrCompanies] = useState<Array<ICompany>>([]);
  const [page, setPage] = useState<number>(1);
  const [popup, setPopupVisibility] = useState<IPopup>({
    visible: false,
    symbol: "",
    name: "",
  });

  useEffect(() => {
    let apiClient = new ApiClient();
    apiClient.getListedCompanies()
    .then(response => response.text())
    .then(response => decodeString(response))
    .then(response => {setCompanies(response); setCurrCompanies(response)})
    .catch(e => console.log(e));
  }, []);

  const recordsPerPage = 25;
  let counter = 0;

  const generatePages = () => {
    let size = Math.ceil((currCompanies.length)/recordsPerPage);
    let res = [];
    if(page>6) res.push(<PageBlock key={counter++} onClick={() => setPage(1)}>{"<<"}</PageBlock>)
    if(page>1) res.push(<PageBlock key={counter++} onClick={() => setPage(page-1)}>{"<"}</PageBlock>)
    for(let i = -5; i<=5; i++){
      if(i === 0){
        res.push(<PageBlock key={counter++} id="current-page" onClick={() => setPage(page+i)}>{page+i}</PageBlock>);
      }
      else if(page+i>=1 && page+i<size) res.push(<PageBlock key={counter++} onClick={() => setPage(page+i)}>{page+i}</PageBlock>);
    }
    if(page+1<size) res.push(<PageBlock key={counter++} onClick={() => setPage(page+1)}>{">"}</PageBlock>)
    if(page+6<size) res.push(<PageBlock key={counter++} onClick={() => setPage(size)}>{">>"}</PageBlock>)
    return res;
  };

  return (
    <>
      {popup.visible ? <CompanyInfo closePopup={setPopupVisibility} name={popup.name} symbol={popup.symbol}/> : null}
      
      <MainDiv>
        <Title>Stock Platform</Title>
        <Navi allCompanies={allCompanies} setCurrCompanies={setCurrCompanies}/>
        {allCompanies.length > 0 ? 
        <div>
          <PageWrap>
            {generatePages()}
          </PageWrap>
          <StockTable>
          <thead>
           <tr>
              <th id="symbol">Company Symbol</th>
              <th id="name">Company Name</th>
              <th id="exchange">Exchange</th>
            </tr>
          </thead>
          <tbody>
          {currCompanies.slice((page-1)*recordsPerPage,page*recordsPerPage).map(company => <CompanyBlock key={counter++} showPopup={setPopupVisibility} symbol={company.symbol} name={company.name} exchange={company.exchange}/>)}
          </tbody>
        </StockTable>
          <PageWrap>
          {generatePages()}
        </PageWrap>
        </div>
        :
        null}
      </MainDiv>
    </>
  );
}

export default App;