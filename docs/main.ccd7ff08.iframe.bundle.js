(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{443:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"Default",(function(){return AnnotateCanvas_stories_Default}));__webpack_require__(10),__webpack_require__(295),__webpack_require__(5),__webpack_require__(8),__webpack_require__(7),__webpack_require__(18),__webpack_require__(11),__webpack_require__(12),__webpack_require__(15),__webpack_require__(14),__webpack_require__(6),__webpack_require__(25);var react=__webpack_require__(0),react_default=__webpack_require__.n(react),dist=__webpack_require__(105),fabric=(__webpack_require__(23),__webpack_require__(137),__webpack_require__(87)),baseAttrNames=(__webpack_require__(22),[].concat(["Rect","Circle","Ellipse","Path","Textbox"],["SVG"]),["fill","stroke","strokeWidth"]),uiDefaults={mode:"draw",shape:"Rect",fontSize:12,color:"blue",strokeWidth:3,fontFamily:"Times New Roman"},fabricObjAttrsLookup={Rect:[].concat(baseAttrNames,["width","height"]),Circle:[].concat(baseAttrNames,["radius"]),Ellipse:[].concat(baseAttrNames,["rx","ry"]),Textbox:[].concat(baseAttrNames,["text","fontFamily","fontSize","width","height"]),Path:[].concat(baseAttrNames,["path"]),SVG:[]},v4=(__webpack_require__(57),__webpack_require__(61),__webpack_require__(867),__webpack_require__(47),__webpack_require__(888));function asyncGeneratorStep(gen,resolve,reject,_next,_throw,key,arg){try{var info=gen[key](arg),value=info.value}catch(error){return void reject(error)}info.done?resolve(value):Promise.resolve(value).then(_next,_throw)}var FabricObjectDefaults={perPixelTargetFind:!0,noScaleCache:!1,strokeUniform:!0},makeFabricObj=function(){var _ref=function _asyncToGenerator(fn){return function(){var self=this,args=arguments;return new Promise((function(resolve,reject){var gen=fn.apply(self,args);function _next(value){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"next",value)}function _throw(err){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"throw",err)}_next(void 0)}))}}(regeneratorRuntime.mark((function _callee(props){var newFObj,t;return regeneratorRuntime.wrap((function _callee$(_context){for(;;)switch(_context.prev=_context.next){case 0:if("Textbox"!==props.etype){_context.next=4;break}newFObj=new fabric.fabric.Textbox("text",Object.assign({text:"Enter text...",fontFamily:"Times New Roman"},FabricObjectDefaults,props)),_context.next=21;break;case 4:if("Path"!==props.etype){_context.next=8;break}newFObj=new fabric.fabric.Path(props.path,Object.assign({strokeLineCap:"round"},FabricObjectDefaults,props)),_context.next=21;break;case 8:if("Rect"!==props.etype){_context.next=12;break}newFObj=new fabric.fabric.Rect(Object.assign({},FabricObjectDefaults,props)),_context.next=21;break;case 12:if("Circle"!==props.etype){_context.next=16;break}newFObj=new fabric.fabric.Circle(Object.assign({},FabricObjectDefaults,props)),_context.next=21;break;case 16:if("Ellipse"!==props.etype){_context.next=20;break}newFObj=new fabric.fabric.Ellipse(Object.assign({},FabricObjectDefaults,props)),_context.next=21;break;case 20:throw Error('Failed to deserialize element of unsupported type "'+props.etype+'".');case 21:return props.transformMatrix&&(t=fabric.fabric.util.qrDecompose(props.transformMatrix),newFObj.set(t),newFObj.setPositionByOrigin({x:t.translateX,y:t.translateY},"center","center")),newFObj.setCoords(),_context.abrupt("return",newFObj);case 24:case"end":return _context.stop()}}),_callee)})));return function makeFabricObj(_x){return _ref.apply(this,arguments)}}(),SHAPES=["Ellipse","Rect","Circle","Triangle"];var AnnotateCanvas_useDrawShapeHandler=function useDrawShapeHandler(fabricCanvasRef,uiState,onAddElement){var uiStateRef=react_default.a.useRef(uiState);react_default.a.useEffect((function(){var fcanvas=fabricCanvasRef.current;fcanvas.on("mouse:down",draw_shape_handle_pointer_down),fcanvas.on("mouse:move",draw_shape_handle_pointer_move),fcanvas.on("mouse:up",draw_shape_handle_pointer_up),fcanvas.on("path:created",handle_path_created),fcanvas.defaultCursor="crosshair"}),[]),react_default.a.useEffect((function(){uiStateRef.current=uiState}),[uiState]);var handle_path_created=function handle_path_created(meta){var k,fObj=meta.path;for(k in FabricObjectDefaults)fObj.set(k,FabricObjectDefaults[k]);null==onAddElement||onAddElement("Path",fObj)};react_default.a.useEffect((function(){var fcanvas=fabricCanvasRef.current;if(uiState.mode){!function setPathDrawing(fcanvas,uiState){fcanvas.isDrawingMode="draw"===uiState.mode&&"Path"===uiState.shape;var brush=fcanvas.freeDrawingBrush;brush.width=uiState.strokeWidth||1,brush.color=uiState.color||"#fff",fcanvas.freeDrawingBrush=brush}(fcanvas,uiState);var isDrawingMode="draw"===uiState.mode;fcanvas.selection=!isDrawingMode,fcanvas.defaultCursor=isDrawingMode?"crosshair":"",fcanvas.skipTargetFind=isDrawingMode}}),[uiState.mode,uiState.shape,uiState.shape]);var currentShapeDrawnRef=react_default.a.useRef(null),draw_shape_handle_pointer_down=Object(react.useCallback)((function(opt){var _uiStateRef$current,_uiStateRef$current2;if("draw"===(null===(_uiStateRef$current=uiStateRef.current)||void 0===_uiStateRef$current?void 0:_uiStateRef$current.mode)&&-1!==SHAPES.indexOf(null===(_uiStateRef$current2=uiStateRef.current)||void 0===_uiStateRef$current2?void 0:_uiStateRef$current2.shape)){var fcanvas=fabricCanvasRef.current,pointer=fcanvas.getPointer(opt.e),_ref=[pointer.x,pointer.y],originX=_ref[0],originY=_ref[1],newElementDefaults=function getElementPropsFromUiState(uiState){var shape=uiState.shape;return Object.assign({},uiState,{etype:shape,fill:-1!==["Textbox","SVG"].indexOf(shape)?uiState.color:"",stroke:-1!==["Textbox","SVG"].indexOf(shape)?"":uiState.color,strokeWidth:-1!==["Textbox"].indexOf(shape)?0:uiState.strokeWidth})}(uiStateRef.current);makeFabricObj(Object.assign({},newElementDefaults,{transformMatrix:[1,0,0,1,originX,originY]})).then((function(shape){fcanvas.add(shape),currentShapeDrawnRef.current={etype:newElementDefaults.etype,originX:originX,originY:originY,fabObj:shape}}))}}),[]),draw_shape_handle_pointer_move=Object(react.useCallback)((function(opt){var _uiStateRef$current3,_uiStateRef$current4,isDrawinShape="draw"===(null===(_uiStateRef$current3=uiStateRef.current)||void 0===_uiStateRef$current3?void 0:_uiStateRef$current3.mode)&&-1!==SHAPES.indexOf(null===(_uiStateRef$current4=uiStateRef.current)||void 0===_uiStateRef$current4?void 0:_uiStateRef$current4.shape);if(null!==currentShapeDrawnRef.current&&isDrawinShape){var fcanvas=fabricCanvasRef.current,pointer=fcanvas.getPointer(opt.e),_currentShapeDrawnRef=currentShapeDrawnRef.current,originX=_currentShapeDrawnRef.originX,originY=_currentShapeDrawnRef.originY,fabObj=currentShapeDrawnRef.current.fabObj;-1!==SHAPES.indexOf(fabObj.etype)?fabObj.set({left:Math.min(originX,pointer.x),top:Math.min(originY,pointer.y)}):fabObj.set({left:pointer.x,top:pointer.y}),"Ellipse"===fabObj.etype?(fabObj.set({rx:Math.abs(originX-pointer.x)/2}),fabObj.set({ry:Math.abs(originY-pointer.y)/2})):"Rect"===fabObj.etype&&(fabObj.set({width:Math.abs(originX-pointer.x)}),fabObj.set({height:Math.abs(originY-pointer.y)})),fcanvas.renderAll()}}),[]),draw_shape_handle_pointer_up=Object(react.useCallback)((function(_opt){var _uiStateRef$current5,_uiStateRef$current6,isDrawinShape="draw"===(null===(_uiStateRef$current5=uiStateRef.current)||void 0===_uiStateRef$current5?void 0:_uiStateRef$current5.mode)&&-1!==SHAPES.indexOf(null===(_uiStateRef$current6=uiStateRef.current)||void 0===_uiStateRef$current6?void 0:_uiStateRef$current6.shape),fcanvas=fabricCanvasRef.current;if(null!==currentShapeDrawnRef.current&&isDrawinShape){var newShape=currentShapeDrawnRef.current;-1!==SHAPES.indexOf(newShape.etype)&&(newShape.fabObj.width<4||newShape.fabObj.height<4)?null==fcanvas||fcanvas.remove(newShape.fabObj):(null==onAddElement||onAddElement(newShape.etype,newShape.fabObj),fcanvas.setActiveObject(newShape.fabObj),fcanvas.requestRenderAll()),currentShapeDrawnRef.current=null}}),[])};__webpack_require__(136),__webpack_require__(34);function useCustomSelectCorners(fabricCanvasRef){react_default.a.useEffect((function(){fabricCanvasRef.current.on("selection:created",handle_selection_created),fabricCanvasRef.current.on("selection:updated",handle_selection_created)}),[]);var handle_selection_created=function handle_selection_created(event){if(event.target){var fObj=event.target;if(setSelectionControls(event.target,fObj.etype),event.target.hasOwnProperty("_objects"))fObj._objects.forEach((function(s){return setSelectionControls(s,s.etype)}))}}}var setSelectionControls=function setSelectionControls(newElement,elementType){newElement.cornerStyle="circle",newElement.cornerStrokeColor="white",newElement.cornerSize=10,newElement.borderDashArray=[5,5],"Textbox"===elementType&&(newElement.setControlVisible("tl",!1),newElement.setControlVisible("mt",!1),newElement.setControlVisible("tr",!1),newElement.setControlVisible("bl",!1),newElement.setControlVisible("mb",!1),newElement.setControlVisible("br",!1))},AnnotateCanvas_useCustomSelectCorners=useCustomSelectCorners;try{useCustomSelectCorners.displayName="useCustomSelectCorners",useCustomSelectCorners.__docgenInfo={description:"",displayName:"useCustomSelectCorners",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/component/AnnotateCanvas/useCustomSelectCorners.tsx#useCustomSelectCorners"]={docgenInfo:useCustomSelectCorners.__docgenInfo,name:"useCustomSelectCorners",path:"src/component/AnnotateCanvas/useCustomSelectCorners.tsx#useCustomSelectCorners"})}catch(__react_docgen_typescript_loader_error){}var AnnotateCanvas_useModifyHandler=function useModifyHandler(fabricCanvasRef,onChangeElement){react_default.a.useEffect((function(){fabricCanvasRef.current.on("object:modified",handle_object_modified)}),[]);var handle_object_modified=function handle_object_modified(event){event.target&&(event.target.hasOwnProperty("_objects")?event.target._objects:[event.target]).forEach((function(obj){if(onChangeElement){var updates={transformMatrix:obj.calcTransformMatrix()},fObj=obj;"Textbox"===fObj.etype&&(updates.text=fObj.text,updates.width=fObj.width),onChangeElement(Object.assign({id:fObj.id},updates))}}))}};__webpack_require__(24);var AnnotateCanvas_useSyncSelection=function useSyncSelection(fabricCanvasRef,onSelection){react_default.a.useEffect((function(){fabricCanvasRef.current.on("selection:created",(function(event){handle_selection_change(event.selected)})),fabricCanvasRef.current.on("selection:updated",(function(event){handle_selection_change(event.selected,event.deselected)})),fabricCanvasRef.current.on("selection:cleared",(function(event){handle_selection_change(event.selected,event.deselected)}))}),[]);var handle_selection_change=function handle_selection_change(added,removed){var s=fabricCanvasRef.current.getActiveObjects().map((function(e){return e.id})),a=null==added?void 0:added.map((function(e){return e.id})),r=null==removed?void 0:removed.map((function(e){return e.id}));onSelection&&onSelection(s,a||[],r||[])}};var jsx_runtime=__webpack_require__(53),_excluded=["width","height","backgroundColor","attrs"];function _objectWithoutProperties(source,excluded){if(null==source)return{};var key,i,target=function _objectWithoutPropertiesLoose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}var DEFAULT_CANVAS_ATTRS={uniformScaling:!1,preserveObjectStacking:!0,targetFindTolerance:10,selectionFullyContained:!0},FabricCanvas_FabricCanvas=function FabricCanvas(_ref){var _ref$width=_ref.width,width=void 0===_ref$width?100:_ref$width,_ref$height=_ref.height,height=void 0===_ref$height?100:_ref$height,_ref$backgroundColor=_ref.backgroundColor,backgroundColor=void 0===_ref$backgroundColor?"green":_ref$backgroundColor,_ref$attrs=_ref.attrs,attrs=void 0===_ref$attrs?DEFAULT_CANVAS_ATTRS:_ref$attrs,props=_objectWithoutProperties(_ref,_excluded),nativeCanvasRef=react_default.a.useRef(null);return react_default.a.useEffect((function(){props.fabricCanvasRef.current.setWidth(width),props.fabricCanvasRef.current.setHeight(height)}),[width,height]),react_default.a.useEffect((function(){props.fabricCanvasRef.current.backgroundColor=backgroundColor}),[backgroundColor]),Object(react.useEffect)((function(){return null!==nativeCanvasRef.current&&(props.fabricCanvasRef.current=new fabric.fabric.Canvas(nativeCanvasRef.current.id,Object.assign({width:width,height:height,backgroundColor:backgroundColor},attrs))),function(){var _props$fabricCanvasRe;null===(_props$fabricCanvasRe=props.fabricCanvasRef.current)||void 0===_props$fabricCanvasRe||_props$fabricCanvasRe.dispose()}}),[]),Object(jsx_runtime.jsx)("canvas",{ref:nativeCanvasRef,id:"canvas_"+Object(v4.a)()})};FabricCanvas_FabricCanvas.displayName="FabricCanvas";var AnnotateCanvas_FabricCanvas=FabricCanvas_FabricCanvas;try{FabricCanvas_FabricCanvas.displayName="FabricCanvas",FabricCanvas_FabricCanvas.__docgenInfo={description:"",displayName:"FabricCanvas",props:{fabricCanvasRef:{defaultValue:null,description:"",name:"fabricCanvasRef",required:!0,type:{name:"MutableRefObject<Canvas>"}},width:{defaultValue:{value:"100"},description:"",name:"width",required:!1,type:{name:"number"}},height:{defaultValue:{value:"100"},description:"",name:"height",required:!1,type:{name:"number"}},backgroundColor:{defaultValue:{value:"green"},description:"",name:"backgroundColor",required:!1,type:{name:"string"}},attrs:{defaultValue:{value:"{\n  uniformScaling: false,\n  preserveObjectStacking: true,\n  targetFindTolerance: 10,\n  // note: currently, canvas group selection only the selection rect with shape bounds.\n  // ref: https://github.com/fabricjs/fabric.js/issues/3773\n  // So next best thing is to require user's selection rect to contain the entire object.\n  selectionFullyContained: true,\n}"},description:"",name:"attrs",required:!1,type:{name:"Record<string, string | number | boolean>"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/component/AnnotateCanvas/FabricCanvas.tsx#FabricCanvas"]={docgenInfo:FabricCanvas_FabricCanvas.__docgenInfo,name:"FabricCanvas",path:"src/component/AnnotateCanvas/FabricCanvas.tsx#FabricCanvas"})}catch(__react_docgen_typescript_loader_error){}var AnnotateCanvas_useRedrawElements=function useRedrawElements(fabricCanvasRef,backgroundColor,elements,redrawOnModify){var redrawCanvas=function redrawCanvas(fCanvas){fCanvas.clear(),fCanvas.backgroundColor=backgroundColor,elements.forEach((function(ele){makeFabricObj(ele).then((function(shape){fCanvas.add(shape),ele.fabricObj=shape}))}))};Object(react.useEffect)((function(){redrawOnModify&&redrawCanvas(fabricCanvasRef.current)}),[elements]),Object(react.useEffect)((function(){redrawOnModify||redrawCanvas(fabricCanvasRef.current)}),[])},AnnotateCanvas_excluded=["elements","selection","width","height","backgroundColor","clearOnElementModify","uiState"];function AnnotateCanvas_objectWithoutProperties(source,excluded){if(null==source)return{};var key,i,target=function AnnotateCanvas_objectWithoutPropertiesLoose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}var AnnotateCanvas_AnnotateCanvas=function AnnotateCanvas(_ref){var _ref$elements=_ref.elements,elements=void 0===_ref$elements?[]:_ref$elements,_ref$selection=_ref.selection,selection=void 0===_ref$selection?[]:_ref$selection,_ref$width=_ref.width,width=void 0===_ref$width?100:_ref$width,_ref$height=_ref.height,height=void 0===_ref$height?100:_ref$height,_ref$backgroundColor=_ref.backgroundColor,backgroundColor=void 0===_ref$backgroundColor?"":_ref$backgroundColor,_ref$clearOnElementMo=_ref.clearOnElementModify,clearOnElementModify=void 0===_ref$clearOnElementMo||_ref$clearOnElementMo,_ref$uiState=_ref.uiState,uiState=void 0===_ref$uiState?uiDefaults:_ref$uiState,props=AnnotateCanvas_objectWithoutProperties(_ref,AnnotateCanvas_excluded),fabricCanvasRef=react_default.a.useRef(new fabric.fabric.Canvas(""));return AnnotateCanvas_useRedrawElements(fabricCanvasRef,backgroundColor,elements,clearOnElementModify),AnnotateCanvas_useSyncSelection(fabricCanvasRef,props.onSelection),AnnotateCanvas_useCustomSelectCorners(fabricCanvasRef),AnnotateCanvas_useDrawShapeHandler(fabricCanvasRef,uiState,props.onAddElement),AnnotateCanvas_useModifyHandler(fabricCanvasRef,props.onChangeElement),function useApplyAttrsToSelection(canvasRef,uiState,selectedIds,elements,onChangeElement){var updateSelectedElement=function updateSelectedElement(key,value){elements.forEach((function(element){if(-1!==selectedIds.indexOf(element.id)){var _onChangeElement,etype=element.etype,adjKey=key;if("Textbox"===etype&&"strokeWidth"===key)return;"color"===key&&(adjKey="Textbox"===etype?"fill":"stroke"),element.fabricObj&&element.fabricObj.set(adjKey,value),onChangeElement&&onChangeElement(((_onChangeElement={id:element.id})[adjKey]=value,_onChangeElement))}})),canvasRef.current.renderAll()};Object(react.useEffect)((function(){return updateSelectedElement("fontSize",uiState.fontSize)}),[uiState.fontSize]),Object(react.useEffect)((function(){return updateSelectedElement("strokeWidth",uiState.strokeWidth)}),[uiState.strokeWidth]),Object(react.useEffect)((function(){return updateSelectedElement("color",uiState.color)}),[uiState.color])}(fabricCanvasRef,uiState,selection,elements,props.onChangeElement),function useCanvasDebugger(elements,selection){react_default.a.useEffect((function(){var elementSelection=elements.filter((function(e){return-1!==selection.indexOf(e.id)}));elementSelection.length&&console.log("selected: ",function getUiStateFromElement(element){var uiState={shape:element.etype};return-1!==["Textbox"].indexOf(element.etype)&&(uiState.color=element.fill,uiState.fontSize=element.fontSize,uiState.fontFamily=element.fontFamily),-1!=["Rect","Circle","Triangle","Ellipse","Path"].indexOf(element.etype)&&(uiState.strokeWidth=element.strokeWidth,uiState.color=element.stroke),uiState}(elementSelection[0]))}),[elements,selection])}(elements,selection),Object(jsx_runtime.jsx)(AnnotateCanvas_FabricCanvas,{fabricCanvasRef:fabricCanvasRef,width:width,height:height,backgroundColor:backgroundColor})};AnnotateCanvas_AnnotateCanvas.displayName="AnnotateCanvas";var component_AnnotateCanvas=AnnotateCanvas_AnnotateCanvas;try{AnnotateCanvas_AnnotateCanvas.displayName="AnnotateCanvas",AnnotateCanvas_AnnotateCanvas.__docgenInfo={description:"",displayName:"AnnotateCanvas",props:{elements:{defaultValue:{value:"[]"},description:"",name:"elements",required:!1,type:{name:"AnnotateElement[]"}},selection:{defaultValue:{value:"[]"},description:"",name:"selection",required:!1,type:{name:"string[]"}},uiState:{defaultValue:{value:"{\n  mode: 'draw',\n  shape: 'Rect',\n  fontSize: 12,\n  color: 'blue',\n  strokeWidth: 3,\n  fontFamily: 'Times New Roman',\n}"},description:"",name:"uiState",required:!1,type:{name:"UserControllerInputs"}},width:{defaultValue:{value:"100"},description:"",name:"width",required:!1,type:{name:"number"}},height:{defaultValue:{value:"100"},description:"",name:"height",required:!1,type:{name:"number"}},backgroundColor:{defaultValue:{value:""},description:"",name:"backgroundColor",required:!1,type:{name:"string"}},clearOnElementModify:{defaultValue:{value:"true"},description:"",name:"clearOnElementModify",required:!1,type:{name:"boolean"}},onAddElement:{defaultValue:null,description:"",name:"onAddElement",required:!1,type:{name:"((etype: AnnotateElementType, element: Object) => void)"}},onChangeElement:{defaultValue:null,description:"",name:"onChangeElement",required:!1,type:{name:"((element: Partial<AnnotateElement>) => void)"}},onSelection:{defaultValue:null,description:"",name:"onSelection",required:!1,type:{name:"((selected: string[], added: string[], removed: string[]) => void)"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/component/AnnotateCanvas/index.tsx#AnnotateCanvas"]={docgenInfo:AnnotateCanvas_AnnotateCanvas.__docgenInfo,name:"AnnotateCanvas",path:"src/component/AnnotateCanvas/index.tsx#AnnotateCanvas"})}catch(__react_docgen_typescript_loader_error){}__webpack_require__(870),__webpack_require__(290);function _toConsumableArray(arr){return function _arrayWithoutHoles(arr){if(Array.isArray(arr))return _arrayLikeToArray(arr)}(arr)||function _iterableToArray(iter){if("undefined"!=typeof Symbol&&null!=iter[Symbol.iterator]||null!=iter["@@iterator"])return Array.from(iter)}(arr)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function elementsActionReducer(state,action){switch(action.type){case"addElement":if(!action.newElement.id)throw Error("Unexpected add element with no new id: "+action.newElement);return[].concat(_toConsumableArray(state),[action.newElement]);case"changeElement":return state.map((function(element){return element.id===action.elementUpdates.id?Object.assign({},element,action.elementUpdates):element}));case"removeElement":var removeIndex=state.reduce((function(a,c,index){return-1!==action.removeIds.indexOf(c.id)&&a.push(index),a}),[]),updatedElements=_toConsumableArray(state);return removeIndex.reverse().forEach((function(removeIndex){updatedElements.splice(removeIndex,1)})),updatedElements}}var sampleRectElement={id:"pink_rect_id",etype:"Rect",transformMatrix:[1,0,0,1,100,100],fill:"",stroke:"pink",strokeWidth:2,width:100,height:100},sampleAnnotations2=[sampleRectElement,Object.assign({},sampleRectElement,{id:"blue_rect_id",stroke:"skyblue",transformMatrix:[1,0,0,1,180,140],width:150,height:100}),{id:"circle_id",etype:"Circle",transformMatrix:[1,0,0,1,50,50],radius:30,fill:"",stroke:"MediumSeaGreen",strokeWidth:5},{id:"textbox_id",etype:"Textbox",transformMatrix:[1,0,0,1,200,200],text:"hello, world!",fontSize:25,fontFamily:"Times New Roman",fill:"rgba(255,255,122,0.8)",width:200},{id:"path_id",etype:"Path",transformMatrix:[1,0,0,1,200,200],stroke:"DodgerBlue",strokeWidth:3,fill:"",path:"M 0 0 L 200 100 L 170 200 z"}];function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null==_i)return;var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}(arr,i)||function AnnotateCanvas_stories_unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return AnnotateCanvas_stories_arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return AnnotateCanvas_stories_arrayLikeToArray(o,minLen)}(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function AnnotateCanvas_stories_arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}var AnnotateCanvas_stories_Default=function Default(){var shapeKnob=Object(dist.optionsKnob)("Shape",{Ellipse:"Ellipse",Rect:"Rect",SVG:"SVG",Textbox:"Textbox",Path:"Path"},"Rect",{display:"inline-radio"}),canvasModeKnob=Object(dist.optionsKnob)("Canvas Mode",{draw:"draw",selection:"selection",panZoom:"panZoom"},"draw",{display:"inline-radio"}),fontSizeKnob=Object(dist.number)("Attr/Font Size",12,{range:!0,min:6,max:50,step:1}),colorKnob=Object(dist.color)("Stroke","#11ff33"),strokeWidthKnob=Object(dist.number)("Stroke Width",3,{range:!0,min:1,max:10,step:1}),_useState2=_slicedToArray(Object(react.useState)([]),2),selection=_useState2[0],setSelection=_useState2[1],_React$useReducer2=_slicedToArray(react_default.a.useReducer(elementsActionReducer,sampleAnnotations2),2),elementsState=_React$useReducer2[0],elementsDispatcher=_React$useReducer2[1],uiState={mode:canvasModeKnob,shape:shapeKnob,fontSize:fontSizeKnob,color:colorKnob,strokeWidth:strokeWidthKnob,fontFamily:"Times New Roman"};return Object(jsx_runtime.jsx)("div",{children:Object(jsx_runtime.jsx)(component_AnnotateCanvas,{elements:elementsState,selection:selection,uiState:uiState,width:800,height:600,backgroundColor:"darkgreen",onChangeElement:function onChangeElement(elementUpdates){return elementsDispatcher({type:"changeElement",elementUpdates:elementUpdates})},onAddElement:function onAddElement(etype,newThing){var newElement=function makeElement(etype,fObj){var element=fabricObjAttrsLookup[etype].reduce((function(p,c){return p[c]=fObj[c],p}),{});return element.transformMatrix=fObj.calcTransformMatrix(),Object.assign({etype:etype,id:Object(v4.a)()},element)}(etype,newThing);elementsDispatcher({type:"addElement",newElement:newElement})},onSelection:function onSelection(selection){console.log("...on selection",selection),setSelection(selection)}})})};AnnotateCanvas_stories_Default.displayName="Default";__webpack_exports__.default={title:"Components/AnnotateCanvas"};AnnotateCanvas_stories_Default.parameters=Object.assign({storySource:{source:"(): JSX.Element => {\n  const shapeKnob = optionsKnob(\n    'Shape',\n    {\n      Ellipse: 'Ellipse',\n      Rect: 'Rect',\n      SVG: 'SVG',\n      Textbox: 'Textbox',\n      Path: 'Path',\n    },\n    'Rect',\n    { display: 'inline-radio' },\n  );\n  const canvasModeKnob = optionsKnob(\n    'Canvas Mode',\n    { draw: 'draw', selection: 'selection', panZoom: 'panZoom' },\n    'draw',\n    { display: 'inline-radio' },\n  );\n  const fontSizeKnob = number('Attr/Font Size', 12, {\n    range: true,\n    min: 6,\n    max: 50,\n    step: 1,\n  });\n  const colorKnob = color('Stroke', '#11ff33');\n  const strokeWidthKnob = number('Stroke Width', 3, {\n    range: true,\n    min: 1,\n    max: 10,\n    step: 1,\n  });\n\n  const [selection, setSelection] = useState<string[]>([]);\n  const [elementsState, elementsDispatcher] = React.useReducer(\n    elementsActionReducer,\n    sampleAnnotations2,\n  );\n\n  const uiState: UserControllerInputs = {\n    mode: canvasModeKnob,\n    shape: shapeKnob,\n    fontSize: fontSizeKnob,\n    color: colorKnob,\n    strokeWidth: strokeWidthKnob,\n    fontFamily: 'Times New Roman',\n  };\n\n  return (\n    <div>\n      <AnnotateCanvas\n        elements={elementsState}\n        selection={selection}\n        uiState={uiState}\n        width={800}\n        height={600}\n        backgroundColor={'darkgreen'}\n        onChangeElement={(elementUpdates) =>\n          elementsDispatcher({ type: 'changeElement', elementUpdates })\n        }\n        onAddElement={(etype, newThing) => {\n          const newElement = makeElement(etype, newThing);\n          elementsDispatcher({ type: 'addElement', newElement });\n        }}\n        onSelection={(selection) => {\n          console.log('...on selection', selection);\n          setSelection(selection);\n        }}\n      />\n    </div>\n  );\n}"}},AnnotateCanvas_stories_Default.parameters)},448:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"Default",(function(){return StopWatch_stories_Default}));__webpack_require__(10);var react=__webpack_require__(0),react_default=__webpack_require__.n(react),jsx_runtime=(__webpack_require__(871),__webpack_require__(872),__webpack_require__(414),__webpack_require__(295),__webpack_require__(5),__webpack_require__(8),__webpack_require__(7),__webpack_require__(18),__webpack_require__(11),__webpack_require__(12),__webpack_require__(15),__webpack_require__(14),__webpack_require__(6),__webpack_require__(25),__webpack_require__(53));function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null==_i)return;var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}(arr,i)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}var StopWatch_StopWatch=function StopWatch(_ref){var text=_ref.text,color=_ref.color,displayTimeInputRef=_ref.displayTimeInputRef,_React$useState2=_slicedToArray(react_default.a.useState(""),2),displayTime=_React$useState2[0],setDisplayTime=_React$useState2[1],displayTimer=react_default.a.useRef(null),startTime=react_default.a.useRef(null);react_default.a.useEffect((function(){return toggleClock(),function(){null!==displayTimer.current&&window.clearInterval(displayTimer.current)}}),[]);var toggleClock=function toggleClock(){null!==displayTimer.current?(window.clearInterval(displayTimer.current),setDisplayTime("0"),displayTimer.current=null):(startTime.current=new Date,displayTimer.current=window.setInterval((function(){setDisplayTime((((new Date).getTime()-startTime.current.getTime())/1e3).toFixed(2))}),100))};return Object(jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[Object(jsx_runtime.jsx)("div",{style:{color:color},children:text}),Object(jsx_runtime.jsx)("input",{ref:displayTimeInputRef,type:"text",defaultValue:displayTime}),Object(jsx_runtime.jsx)("button",{onClick:function onClick(e){return toggleClock()},children:"0"===displayTime?"Start":"Pause"})]})},component_StopWatch=StopWatch_StopWatch;try{StopWatch_StopWatch.displayName="StopWatch",StopWatch_StopWatch.__docgenInfo={description:"",displayName:"StopWatch",props:{text:{defaultValue:null,description:"",name:"text",required:!0,type:{name:"string"}},color:{defaultValue:null,description:"",name:"color",required:!1,type:{name:"string"}},displayTimeInputRef:{defaultValue:null,description:"",name:"displayTimeInputRef",required:!1,type:{name:"RefObject<HTMLInputElement>"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/component/StopWatch/index.tsx#StopWatch"]={docgenInfo:StopWatch_StopWatch.__docgenInfo,name:"StopWatch",path:"src/component/StopWatch/index.tsx#StopWatch"})}catch(__react_docgen_typescript_loader_error){}var dist=__webpack_require__(105),StopWatch_stories_Default=function Default(){var stopWatchTimeDisplayInputRef=react_default.a.createRef();return Object(dist.button)("Tell time using Ref",(function(){var _stopWatchTimeDisplay;alert(null===(_stopWatchTimeDisplay=stopWatchTimeDisplayInputRef.current)||void 0===_stopWatchTimeDisplay?void 0:_stopWatchTimeDisplay.value)})),Object(jsx_runtime.jsx)(component_StopWatch,{displayTimeInputRef:stopWatchTimeDisplayInputRef,text:"hello, world",color:"#00ff00"})};StopWatch_stories_Default.displayName="Default";__webpack_exports__.default={title:"Components/StopWatch"};StopWatch_stories_Default.parameters=Object.assign({storySource:{source:'(): JSX.Element => {\n  const stopWatchTimeDisplayInputRef = React.createRef<HTMLInputElement>();\n\n  button(\'Tell time using Ref\', () => {\n    alert(stopWatchTimeDisplayInputRef.current?.value);\n  });\n\n  return <StopWatch displayTimeInputRef={stopWatchTimeDisplayInputRef} text="hello, world" color="#00ff00" />;\n}'}},StopWatch_stories_Default.parameters)},490:function(module,exports,__webpack_require__){__webpack_require__(491),__webpack_require__(649),__webpack_require__(650),__webpack_require__(875),__webpack_require__(876),__webpack_require__(843),__webpack_require__(881),__webpack_require__(880),__webpack_require__(877),__webpack_require__(882),__webpack_require__(878),__webpack_require__(879),__webpack_require__(883),module.exports=__webpack_require__(857)},558:function(module,exports){},650:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__(347)},857:function(module,exports,__webpack_require__){"use strict";(function(module){(0,__webpack_require__(347).configure)([__webpack_require__(858),__webpack_require__(859),__webpack_require__(873),__webpack_require__(874)],module,!1)}).call(this,__webpack_require__(163)(module))},858:function(module,exports){function webpackEmptyContext(req){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}webpackEmptyContext.keys=function(){return[]},webpackEmptyContext.resolve=webpackEmptyContext,module.exports=webpackEmptyContext,webpackEmptyContext.id=858},859:function(module,exports,__webpack_require__){var map={"./stories/component/AnnotateCanvas.stories.tsx":443,"./stories/component/StopWatch.stories.tsx":448};function webpackContext(req){var id=webpackContextResolve(req);return __webpack_require__(id)}function webpackContextResolve(req){if(!__webpack_require__.o(map,req)){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}return map[req]}webpackContext.keys=function webpackContextKeys(){return Object.keys(map)},webpackContext.resolve=webpackContextResolve,module.exports=webpackContext,webpackContext.id=859},864:function(module,exports){},865:function(module,exports){},866:function(module,exports){},873:function(module,exports,__webpack_require__){var map={"./AnnotateCanvas.stories.tsx":443,"./StopWatch.stories.tsx":448};function webpackContext(req){var id=webpackContextResolve(req);return __webpack_require__(id)}function webpackContextResolve(req){if(!__webpack_require__.o(map,req)){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}return map[req]}webpackContext.keys=function webpackContextKeys(){return Object.keys(map)},webpackContext.resolve=webpackContextResolve,module.exports=webpackContext,webpackContext.id=873},874:function(module,exports){function webpackEmptyContext(req){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}webpackEmptyContext.keys=function(){return[]},webpackEmptyContext.resolve=webpackEmptyContext,module.exports=webpackEmptyContext,webpackEmptyContext.id=874},883:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var preview_namespaceObject={};__webpack_require__.r(preview_namespaceObject),__webpack_require__.d(preview_namespaceObject,"parameters",(function(){return parameters}));__webpack_require__(23),__webpack_require__(5),__webpack_require__(47),__webpack_require__(432),__webpack_require__(136),__webpack_require__(34),__webpack_require__(855),__webpack_require__(856),__webpack_require__(431);var client_api=__webpack_require__(60),esm=__webpack_require__(4),parameters={actions:{argTypesRegex:"^on[A-Z].*"}};function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}Object.keys(preview_namespaceObject).forEach((function(key){var value=preview_namespaceObject[key];switch(key){case"args":case"argTypes":return esm.a.warn("Invalid args/argTypes in config, ignoring.",JSON.stringify(value));case"decorators":return value.forEach((function(decorator){return Object(client_api.c)(decorator,!1)}));case"loaders":return value.forEach((function(loader){return Object(client_api.d)(loader,!1)}));case"parameters":return Object(client_api.e)(function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}({},value),!1);case"argTypesEnhancers":return value.forEach((function(enhancer){return Object(client_api.a)(enhancer)}));case"argsEnhancers":return value.forEach((function(enhancer){return Object(client_api.b)(enhancer)}));case"render":return Object(client_api.g)(value);case"globals":case"globalTypes":var v={};return v[key]=value,Object(client_api.e)(v,!1);default:return console.log(key+" was not supported :( !")}}))}},[[490,2,3]]]);