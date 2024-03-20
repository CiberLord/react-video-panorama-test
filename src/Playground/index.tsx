import React from 'react';

import { Card } from '../Card';
import { Dump } from '../Dump';


import './playground.css';
import { OfferPanorama as OfferPanoramaLegacy } from '../OfferPanorama'
import { OfferPanorama } from '../OfferPanoramaV2';
import { CopyLogButton } from '../CopyLogButton';

function Playground() {
  return (
    <div className="App">
      <div className="Content_wrapper">
      <Card className="App_card">
        <Dump/>
      </Card>
      <Card className="App_card">
        <div className='Video_wrap'>
          <OfferPanorama />
        </div>
      </Card>
      <Card className="App_card">
        <div className='Video_wrap'>
          {/* <OfferPanoramaLegacy shouldSpinOnScroll />   */}
        </div> 
      </Card>
      <Card className="App_card">
        <Dump />
      </Card>
      <Card className="App_card">
        <div className='Video_wrap'>
          {/* <OfferPanorama /> */}
        </div>
      </Card>
      <Card className="App_card">
        <div className='Video_wrap'>
          {/* <OfferPanorama /> */}
        </div>
      </Card>
      <Card className="App_card">
        <Dump />
      </Card>
      <Card className="App_card">
        <Dump/>
      </Card>
      <Card className="App_card">
        <Dump/>
      </Card>
      <Card className="App_card">
        <Dump/>
      </Card>
      <Card className="App_card">
        <Dump/>
      </Card>
      <Card className="App_card">
        <Dump/>
      </Card>
      <Card className="App_card">
        <Dump/>
      </Card>
      <Card className="App_card">
        <Dump/>
      </Card>
      <Card className="App_card">
        <Dump/>
      </Card>
      <Card className="App_card">
        <Dump/>
      </Card>
      <Card className="App_card">
        <Dump/>
      </Card>
      <Card className="App_card">
        <Dump/>
      </Card>
      <Card className="App_card">
        <Dump/>
      </Card>
      <Card className="App_card">
        <Dump/>
      </Card>
      <Card className="App_card">
        <Dump/>
      </Card>
      <Card className="App_card">
        <Dump/>
      </Card>
      <Card className="App_card">
        <Dump/>
      </Card>
      <Card className="App_card">
        <Dump/>
      </Card>
      <Card className="App_card">
        <Dump/>
      </Card>
      <Card className="App_card">
        <Dump/>
      </Card>
      </div>
      <CopyLogButton />
    </div>
  );
}

export { Playground }
