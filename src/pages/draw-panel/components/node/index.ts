import LogicFlow, {
  BaseNodeModel,
  GraphModel,
  ConnectRule,
  CircleNodeModel,
  CircleNode,
  h,
  RectNode,
  RectNodeModel,
  PolygonNode,
  PolygonNodeModel,
} from '@logicflow/core';

// 节点类型
// 矩形：rect(opens new window)
// 圆形: circle(opens new window)
// 椭圆: ellipse(opens new window)
// 多边形: polygon(opens new window)
// 菱形: diamond
// 文本: text(opens new window)
// HTML: html

const colors = ['#5D7092', '#71E8C8', '#40a9ff', '#FB8A4A'];

const done = require('../../../../asset/image/done.png');
const doing = require('../../../../asset/image/doing.png');
const undone = require('../../../../asset/image/undone.png');
// 完成节点样式;
const getLabelShape = function(status: any) {
  const { model } = this.props;
  const { x, y, width, height } = model;
  console.log(x,y,width, height);
  const href = {
    '1': doing,
    '2': done
  }[status] || undone;
  return h("g", {}, [
    h("image", {
      x: x - width / 2 - 2,
      y: y - height / 2 - 2,
      // x: 500, y: 100,
      width: 50,
      height: 50,
      // cursor: "move",
      href,
    }),
  ]);
};
class RectView extends RectNode {
  private getLabelShape(status: any) {
    return getLabelShape.call(this, status);
  }
  /**
   * 完全自定义节点外观方法
   */
  getShape() {
    const { model, graphModel } = this.props;
    const { x, y, width, height, radius } = model;
    const style = model.getNodeStyle();
    return h("g", {}, [
      h("rect", {
        ...style,
        x: x - width / 2,
        y: y - height / 2,
        // x, y,
        rx: radius,
        ry: radius,
        width,
        height
      }),
      this.getLabelShape(model.properties.status)
    ]);
  }
}

// --------------------
// 开始节点 -------------------

class StartNodeModel extends CircleNodeModel {
  constructor(data: BaseNodeModel, graphModel: GraphModel) {
    super(data, graphModel);
    // console.log(data);
    const property = data.properties;
  }

  initNodeData(data: any) {
    // 可以在super之前，强制设置节点文本位置不居中，而且在节点下面
    data.text = {
      value: '开始',
      editable: false, // 不可编辑节点名字
      x: data.x,
      y: data.y,
    };
    super.initNodeData(data);
  }

  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = colors[0];
    style.strokeDasharray = '3 0';
    return style;
  }

  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 16;
    // style.color = '#40a9ff';
    style.color = colors[0];
    return style;
  }

  getConnectedTargetRules(): ConnectRule[] {
    const rules = super.getConnectedTargetRules();
    const geteWayOnlyAsTarget = {
      message: '开始节点只能连出，不能连入！',
      validate: (...args: any[]) => {
        console.log(this);
        console.log(args);
        return false;
      },
    };
    // @ts-ignore
    rules.push(geteWayOnlyAsTarget);
    return rules;
  }
}

// ---------------
// 结束节点 -------------
class FinishNodeModel extends CircleNodeModel {
  constructor(data: BaseNodeModel, graphModel: GraphModel) {
    super(data, graphModel);
    // console.log(data);
    const property = data.properties;
  }

  initNodeData(data: any) {
    let reg = /^结束节点[0-9]+$/;
    let maxNew = this.graphModel?.nodes //找到当前新增节点最高
      ?.filter((item: any) => reg?.test(item?.text?.value))
      ?.map((item: any) => item?.text?.value?.slice?.(4))
      ?.sort((a: any, b: any) => b - a)?.[0];
    // 可以在super之前，强制设置节点文本位置不居中，而且在节点下面
    data.text =
      !data.text || typeof data.text === 'string'
        ? {
            value: `结束节点${maxNew ? Number?.(maxNew) + 1 : 1}`,
            x: data.x,
            y: data.y,
            editable: false, // 不可编辑节点名字
          }
        : {
            ...data.text,
            editable: false,
          };
    super.initNodeData(data);
  }

  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = colors[1];
    style.strokeDasharray = '3 0';
    return style;
  }

  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 16;
    // style.color = '#40a9ff';
    style.color = colors[1];
    style.overflowMode = 'ellipsis';
    return style;
  }

  getConnectedSourceRules(): ConnectRule[] {
    const rules = super.getConnectedSourceRules();
    const geteWayOnlyAsTarget = {
      message: '结束节点只能连入，不能连出！',
      validate: (source: BaseNodeModel) => {
        let isValid = true;
        if (source) {
          // console.log(source);
          isValid = false;
        }
        return isValid;
      },
    };
    // @ts-ignore
    rules.push(geteWayOnlyAsTarget);
    return rules;
  }
}

// 学员节点
class StudentNodeModel extends RectNodeModel {
  constructor(data: BaseNodeModel, graphModel: GraphModel) {
    super(data, graphModel);
    // console.log(data);
    const property = data.properties;
  }

  initNodeData(data: any) {
    let reg = /^学员节点[0-9]+$/;
    let maxNew = this.graphModel?.nodes //找到当前新增节点最高
      ?.filter((item: any) => reg?.test(item?.text?.value))
      ?.map((item: any) => item?.text?.value?.slice?.(4))
      ?.sort((a: any, b: any) => b - a)?.[0];

    // 可以在super之前，强制设置节点文本位置不居中，而且在节点下面
    data.text =
      !data.text || typeof data.text === 'string'
        ? {
            value: `学员节点${maxNew ? Number?.(maxNew) + 1 : 1}`,
            x: data.x,
            y: data.y,
            editable: false, // 不可编辑节点名字
          }
        : {
            ...data.text,
            editable: false,
          };
    super.initNodeData(data);
    this.width = 200;
    this.height = 74;
    this.radius = 8;
  }

  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = colors[2];
    style.strokeDasharray = '3 0';
    style.radius = 8;
    return style;
  }

  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 16;
    style.color = colors[2];
    style.overflowMode = 'ellipsis';
    // style.color = '#7DAAFF';
    return style;
  }
}
// 客户节点
class CustomerNodeModel extends RectNodeModel {
  constructor(data: BaseNodeModel, graphModel: GraphModel) {
    super(data, graphModel);
    // console.log(data);
    const property = data.properties;
  }

  initNodeData(data: any) {
    let reg = /^客户节点[0-9]+$/;
    let maxNew = this.graphModel?.nodes //找到当前新增节点最高
      ?.filter((item: any) => reg?.test(item?.text?.value))
      ?.map((item: any) => item?.text?.value?.slice?.(4))
      ?.sort((a: any, b: any) => b - a)?.[0];
    // 可以在super之前，强制设置节点文本位置不居中，而且在节点下面
    data.text =
      !data.text || typeof data.text === 'string'
        ? {
            value: `客户节点${maxNew ? Number?.(maxNew) + 1 : 1}`,
            x: data.x,
            y: data.y,
            editable: false, // 不可编辑节点名字
          }
        : {
            ...data.text,
            editable: false,
          };
    super.initNodeData(data);
    this.width = 200;
    this.height = 74;
    this.radius = 8;
  }

  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = colors[3];
    style.strokeDasharray = '3 0';
    style.radius = 8;
    return style;
  }

  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 16;
    style.color = colors[3];
    // style.color = '#7DAAFF';
    style.overflowMode = 'ellipsis';
    return style;
  }
}

// 学员意图节点
class StudentIntentNodeModel extends RectNodeModel {
  constructor(data: BaseNodeModel, graphModel: GraphModel) {
    super(data, graphModel);
    // console.log(data);
    const property = data.properties;
  }

  initNodeData(data: any) {
    let reg = /^学员意图节点[0-9]+$/;
    let maxNew = this.graphModel?.nodes //找到当前新增节点最高
      ?.filter((item: any) => reg?.test(item?.text?.value))
      ?.map((item: any) => item?.text?.value?.slice?.(6))
      ?.sort((a: any, b: any) => b - a)?.[0];

    // 可以在super之前，强制设置节点文本位置不居中，而且在节点下面
    data.text =
      !data.text || typeof data.text === 'string'
        ? {
            value: `学员意图节点${maxNew ? Number?.(maxNew) + 1 : 1}`,
            x: data.x,
            y: data.y,
            editable: false, // 不可编辑节点名字
          }
        : {
            ...data.text,
            editable: false,
          };
    super.initNodeData(data);
    this.width = 200;
    this.height = 74;
    this.radius = 8;
  }

  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = colors[2];
    style.strokeDasharray = '3 0';
    style.radius = 8;
    return style;
  }

  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 16;
    style.color = colors[2];
    style.overflowMode = 'ellipsis';
    // style.color = '#7DAAFF';
    return style;
  }
}
// 客户意图节点
class CustomerIntentNodeModel extends RectNodeModel {
  constructor(data: BaseNodeModel, graphModel: GraphModel) {
    super(data, graphModel);
    // console.log(data);
    const property = data.properties;
  }

  initNodeData(data: any) {
    let reg = /^客户意图节点[0-9]+$/;
    let maxNew = this.graphModel?.nodes //找到当前新增节点最高
      ?.filter((item: any) => reg?.test(item?.text?.value))
      ?.map((item: any) => item?.text?.value?.slice?.(6))
      ?.sort((a: any, b: any) => b - a)?.[0];
    // 可以在super之前，强制设置节点文本位置不居中，而且在节点下面
    data.text =
      !data.text || typeof data.text === 'string'
        ? {
            value: `客户意图节点${maxNew ? Number?.(maxNew) + 1 : 1}`,
            x: data.x,
            y: data.y,
            editable: false, // 不可编辑节点名字
          }
        : {
            ...data.text,
            editable: false,
          };
    super.initNodeData(data);
    this.width = 200;
    this.height = 74;
    this.radius = 8;
  }

  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = colors[3];
    style.strokeDasharray = '3 0';
    style.radius = 8;
    return style;
  }

  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 16;
    style.color = colors[3];
    // style.color = '#7DAAFF';
    style.overflowMode = 'ellipsis';
    return style;
  }
}

// 节点注册方法
export function registerNode(lf: any) {
  // 注册结束节点
  lf.batchRegister([
    {
      type: 'finish',
      view: CircleNode,
      model: FinishNodeModel,
    },
    {
      type: 'start',
      view: CircleNode,
      model: StartNodeModel,
    },
    {
      type: 'student',
      view: RectNode,
      model: StudentNodeModel,
    },
    {
      type: 'customer',
      view: RectNode,
      model: CustomerNodeModel,
    },
    {
      type: 'studentIntent',
      view: RectNode,
      model: StudentIntentNodeModel,
    },
    {
      type: 'customerIntent',
      view: RectNode,
      model: CustomerIntentNodeModel,
    },
  ]);
}

// 节点注册方法
export function registerNode2(lf: any) {
  // 注册结束节点
  lf.batchRegister([
    {
      type: 'finish',
      view: CircleNode,
      model: FinishNodeModel,
    },
    {
      type: 'start',
      view: CircleNode,
      model: StartNodeModel,
    },
    {
      type: 'student',
      view: RectView,
      model: StudentNodeModel,
    },
    {
      type: 'customer',
      view: RectNode,
      model: CustomerNodeModel,
    },
    {
      type: 'studentIntent',
      view: RectView,
      model: StudentIntentNodeModel,
    },
    {
      type: 'customerIntent',
      view: RectView,
      model: CustomerIntentNodeModel,
    },
  ]);
}
