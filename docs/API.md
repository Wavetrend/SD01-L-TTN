## Modules

<dl>
<dt><a href="#src/downlink.module_js">src/downlink.js</a></dt>
<dd><p>SD01-L Water Temperature Monitor Downlink Payload Formatter for TTN</p>
</dd>
<dt><a href="#src/uplink.module_js">src/uplink.js</a></dt>
<dd><p>SD01-L Water Temperature Monitor Downlink Payload Formatter for TTN</p>
</dd>
</dl>

<a name="src/downlink.module_js"></a>

## src/downlink.js
SD01-L Water Temperature Monitor Downlink Payload Formatter for TTN

**See**

- [https://www.thethingsindustries.com/docs/integrations/payload-formatters/javascript/](https://www.thethingsindustries.com/docs/integrations/payload-formatters/javascript/)
- [https://www.youtube.com/watch?v=nT2FnwCoP7w](https://www.youtube.com/watch?v=nT2FnwCoP7w)

**Author**: Dave Meehan  
**Copyright**: Wavetrend Europe Ltd  

* [src/downlink.js](#src/downlink.module_js)
    * [~encodeDownlink(input)](#src/downlink.module_js..encodeDownlink) ⇒ [<code>EncoderOutput</code>](#TTN.Downlink.EncoderOutput)
    * [~Encoder(object)](#src/downlink.module_js..Encoder) ⇒ <code>Array.&lt;number&gt;</code>
    * [~decodeDownlink(input)](#src/downlink.module_js..decodeDownlink) ⇒ [<code>DecoderOutput</code>](#TTN.Downlink.DecoderOutput)

<a name="src/downlink.module_js..encodeDownlink"></a>

### src/downlink.js~encodeDownlink(input) ⇒ [<code>EncoderOutput</code>](#TTN.Downlink.EncoderOutput)
Entry point for TTN V3 downlink encoder

**Kind**: inner method of [<code>src/downlink.js</code>](#src/downlink.module_js)  

| Param | Type |
| --- | --- |
| input | [<code>EncoderInput</code>](#TTN.Downlink.EncoderInput) | 

<a name="src/downlink.module_js..Encoder"></a>

### src/downlink.js~Encoder(object) ⇒ <code>Array.&lt;number&gt;</code>
Entry point for TTN V2 downlink encoder

**Kind**: inner method of [<code>src/downlink.js</code>](#src/downlink.module_js)  
**Returns**: <code>Array.&lt;number&gt;</code> - - byte array of encoded payload or empty array  

| Param | Type |
| --- | --- |
| object | [<code>DownlinkPayloads</code>](#Wavetrend.SD01L.DownlinkPayloads) | 

<a name="src/downlink.module_js..decodeDownlink"></a>

### src/downlink.js~decodeDownlink(input) ⇒ [<code>DecoderOutput</code>](#TTN.Downlink.DecoderOutput)
Entry point for TTN V3 downlink decoder (inverse of encodeDownlink)

**Kind**: inner method of [<code>src/downlink.js</code>](#src/downlink.module_js)  

| Param | Type |
| --- | --- |
| input | [<code>DecoderInput</code>](#TTN.Downlink.DecoderInput) | 

<a name="src/uplink.module_js"></a>

## src/uplink.js
SD01-L Water Temperature Monitor Downlink Payload Formatter for TTN

**See**

- [https://www.thethingsindustries.com/docs/integrations/payload-formatters/javascript/](https://www.thethingsindustries.com/docs/integrations/payload-formatters/javascript/)
- [https://www.youtube.com/watch?v=nT2FnwCoP7w](https://www.youtube.com/watch?v=nT2FnwCoP7w)

**Author**: Dave Meehan  
**Copyright**: Wavetrend Europe Ltd  

* [src/uplink.js](#src/uplink.module_js)
    * [~decodeUplink(input)](#src/uplink.module_js..decodeUplink) ⇒ [<code>DecoderOutput</code>](#TTN.Uplink.DecoderOutput)
    * [~Decoder(bytes, port)](#src/uplink.module_js..Decoder) ⇒ [<code>UplinkPayloads</code>](#Wavetrend.SD01L.UplinkPayloads) \| <code>null</code>

<a name="src/uplink.module_js..decodeUplink"></a>

### src/uplink.js~decodeUplink(input) ⇒ [<code>DecoderOutput</code>](#TTN.Uplink.DecoderOutput)
Entry point for TTN V3 uplink decoder

**Kind**: inner method of [<code>src/uplink.js</code>](#src/uplink.module_js)  
**Returns**: [<code>DecoderOutput</code>](#TTN.Uplink.DecoderOutput) - - object containing the result of the decode, which might include warnings or errors  

| Param | Type |
| --- | --- |
| input | [<code>DecoderInput</code>](#TTN.Uplink.DecoderInput) | 

<a name="src/uplink.module_js..Decoder"></a>

### src/uplink.js~Decoder(bytes, port) ⇒ [<code>UplinkPayloads</code>](#Wavetrend.SD01L.UplinkPayloads) \| <code>null</code>
Entry point for TTN V2 uplink decoder

**Kind**: inner method of [<code>src/uplink.js</code>](#src/uplink.module_js)  
**Returns**: [<code>UplinkPayloads</code>](#Wavetrend.SD01L.UplinkPayloads) \| <code>null</code> - - object containing decoded payload, or null if an error is encountered  

| Param | Type | Description |
| --- | --- | --- |
| bytes | <code>Array.&lt;number&gt;</code> | array of received bytes |
| port | <code>number</code> | LoRaWAN fPort number |

