import React, { useEffect , useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';
import {Map , TileLayer , Marker } from 'react-leaflet';
import './style.css';
import axios from 'axios';
import logo from '../../assets/logo.svg';

interface Item {
  id: number,
  title:string,
  image_url:string
}

interface UFS {
  sigla: string
}

const CreatePointer = () =>{
 const [itens,setItens] = useState<Item[]>([]);
 const [ufs,setUfS] = useState<UFS[]>([]);
 
 
 useEffect(() => {
   api.get('itens').then(response =>{
    setItens(response.data);
 });
 },[]);

 useEffect(() => {
  axios.get<UFS[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados/").then(response => {
    setUfS(response.data);
  });
 },[]);

  return(
    <div id="page-create-point">
      <header>        
          <img src={logo} alt="Ecoleta"/>
          <Link to="/">
            <FiArrowLeft />
              Voltar para Home        
        </Link>
      </header>
      <form>
        <h1>Cadastro do <br /> ponto de coleta</h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name" />
          </div>
          <div className="field-group">
            <div className="field">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

            <Map center={[-15.8477559,-48.0505933]} zoom={15}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[-15.8477559,-48.0505933]} />
            </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="address">Endereço</label>
              <input type="text" name="address" id="address" />
            </div>
            <div className="field" >
              <label htmlFor="number">Numero</label>
              <input type="number" name="number" id="number" />
            </div>
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              
              <select name="uf" id="uf">
                <option value="0">Selecione um dos estados</option>
                  {ufs.map(uf => (
                    <option key={uf.sigla} value={uf.sigla}>{uf.sigla}</option>
                  ))}   
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city">
                <option value="0">Selecione uma Cidade</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de Coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>
          <ul className="items-grid">
            {itens.map(item => (
              <li key={item.id} className="selected">
                <img src={item.image_url} alt={item.title}/>
                <span>{item.title}</span>
              </li>            
            ))}
          </ul>

        </fieldset>
        <button type="submit">Cadastrar ponto de coleta</button>


      </form>

  
    </div>
  );
}

export default CreatePointer;