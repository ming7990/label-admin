import LogicFlow, {
  BaseNodeModel,
  GraphModel,
  ConnectRule,
  CircleNodeModel,
  CircleNode,
  h,
  RectNode,
  RectNodeModel,
  PolylineEdge,
  PolylineEdgeModel,
  HtmlNode,
  HtmlNodeModel,
} from '@logicflow/core';
import ReactDOM from 'react-dom';
import { Popover, Button, Select, message } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  LockOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import style from './index.less';

const colors = ['#69C0FF', '#FFC069', '#D9D9D9', '#C2C8D5'];
const bgColors = ['#E6F7FF', '#FFF7E6', '#FFFFFF'];

const EVENT_BUS: any = {};

class CourseNodeModel extends RectNodeModel {
  constructor(data: BaseNodeModel, graphModel: GraphModel) {
    super(data, graphModel);
    // console.log(data);
    const property = data.properties;
  }

  initNodeData(data: any) {
    // 可以在super之前，强制设置节点文本位置不居中，而且在节点下面
    data.text =
      !data.text || typeof data.text === 'string'
        ? {
            value: data.text,
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
    this.height = 58;
    this.radius = 30;
  }

  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = colors[0];
    style.fill = '#E6F7FF';
    style.strokeDasharray = '3 0';
    style.radius = 30;
    return style;
  }

  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 16;
    style.color = 'rgba(0,0,0,0.85)';
    // style.color = '#7DAAFF';
    style.overflowMode = 'ellipsis';
    return style;
  }
}

class TaskNodeModel extends RectNodeModel {
  constructor(data: BaseNodeModel, graphModel: GraphModel) {
    super(data, graphModel);
    // console.log(data);
    const property = data.properties;
  }

  initNodeData(data: any) {
    // 可以在super之前，强制设置节点文本位置不居中，而且在节点下面
    data.text =
      !data.text || typeof data.text === 'string'
        ? {
            value: data.text,
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
    this.height = 58;
    this.radius = 30;
  }

  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = colors[1];
    style.fill = bgColors[1];
    style.strokeDasharray = '3 0';
    style.radius = 30;
    return style;
  }

  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 16;
    style.color = 'rgba(0,0,0,0.85)';
    style.overflowMode = 'ellipsis';
    return style;
  }
}

// html 节点测试
class StepHtmlNodeModel extends HtmlNodeModel {
  initNodeData(data: any) {
    // 可以在super之前，强制设置节点文本位置不居中，而且在节点下面
    console.log(JSON.parse(JSON.stringify(data)));
    data.text =
      !data.text || typeof data.text === 'string'
        ? {
            value: data.text,
            x: data.x,
            y: data.y,
            editable: false, // 可编辑节点名字
          }
        : {
            ...data.text,
            editable: false,
          };
    super.initNodeData(data);
    this.width = 200;
    this.height = 74;
    this.radius = 30;
  }
  setAttributes() {
    this.text.editable = false; // 禁止节点文本编辑
    // 设置节点宽高和锚点
    const width = 200;
    const height = 74;
    this.width = width;
    this.height = height;
    this.anchorsOffset = [
      [width / 2, 0],
      [0, height / 2],
      [-width / 2, 0],
      [0, -height / 2],
    ];
  }

  getTextStyle() {
    const style = super.getTextStyle();
    style.fontSize = 16;
    style.color = 'rgba(0,0,0,0.85)';
    style.overflowMode = 'ellipsis';
    return style;
  }
}

// status: wait ==> 置灰 // doing ==> 进行中 // finish ==> 完成
const StepHtmlBox = (props: any) => {
  const { properties, text, item } = props;

  const { status } = properties;

  let icon = null;

  return (
    <div className={`${style['step-box']} ${style[`step-box_normal`]}`}>
      <div className={style['step-header']}>
        {/* <div className={style['step-title']}>{text}</div> */}
        {/* <Select value={text} style={{ width: 100 }}>
        </Select> */}
      </div>
    </div>
  );
};

class StepHtmlNode extends HtmlNode {
  setHtml(rootEl: HTMLElement) {
    const { properties, text } = this.props.model;
    ReactDOM.render(
      <StepHtmlBox text={text.value} properties={properties} item={this.props.model} />,
      rootEl,
    );
  }
}

// ---------- 线

class DiyLineEdgeModel extends PolylineEdgeModel {
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    const { properties } = this;
    style.stroke = '#AAB7C4';
    style.strokeWidth = 1;
    return style;
  }

  getTextStyle() {
    const style: any = super.getTextStyle();
    style.color = 'rgba(0,0,0,0.85)';
    style.fontSize = 14;
    return style;
  }
}

export function registerNode(lf: any, options: any) {
  const { eventCenter } = lf.graphModel;
  EVENT_BUS.eventCenter = eventCenter;
  // 任务节点注册
  lf.batchRegister([
    {
      type: 'course', // 标题
      view: RectNode,
      model: CourseNodeModel,
    },
    {
      type: 'task', // 标题
      view: RectNode,
      model: TaskNodeModel,
    },
    // {
    //   type: 'step', // 标题
    //   view: RectNode,
    //   model: StepNodeModel,
    // },
    {
      type: 'step',
      view: StepHtmlNode,
      model: StepHtmlNodeModel,
    },
    // {
    //   type: 'diy-line',
    //   view: PolylineEdge,
    //   model: DiyLineEdgeModel
    // }
  ]);
  if (!lf.extension.menu) {
    return;
  }
  if (options?.isSilentMode) {
    lf.extension.menu.setMenuByType({
      type: 'course',
      menu: [],
    });
    lf.extension.menu.setMenuByType({
      type: 'task',
      menu: [],
    });
    lf.extension.menu.setMenuByType({
      type: 'step',
      menu: [],
    });
    return;
  }
  // 任务节点菜单
  lf.extension.menu.setMenuByType({
    type: 'course',
    menu: [
      {
        text: '添加子任务',
        callback(node: any) {
          console.log(node);
          options?.addSubTask?.(node);
        },
      },
      // {
      //   text: '删除',
      //   callback: async (node: any) => {
      //     if (options.deleteNode) {
      //       let res: any = options.deleteNode(node.id);
      //       if (res) {
      //         lf.deleteNode(node.id);
      //       }
      //     } else {
      //       // 扩散删除
      //       lf.deleteNode(node.id);
      //     }
      //   },
      // },
    ],
  });

  lf.extension.menu.setMenuByType({
    type: 'task',
    menu: [
      {
        text: '添加子步骤',
        callback(node: any) {
          options?.addSubStep?.(node);
        },
      },
      {
        text: '删除',
        callback: async (node: any) => {
          console.log(node);
          deleteTask(lf, node);
          // if (options.deleteNode) {
          //   let res: any = options.deleteNode(node.id);
          //   if (res) {
          //     lf.deleteNode(node.id);
          //   }
          // } else {
          //   lf.deleteNode(node.id);
          // }
        },
      },
    ],
  });

  lf.extension.menu.setMenuByType({
    type: 'step',
    menu: [
      {
        text: '添加子步骤',
        callback(node: any) {
          options?.addSubStep?.(node);
        },
      },
      {
        text: '删除',
        callback: async (node: any) => {
          console.log(node);
          deleteStep(lf, node);
        },
      },
    ],
  });
}

const deleteStep = (lf: any, node: any) => {
  //删除子步骤
  const { nodes, edges } = lf.graphModel;
  //连进来的线
  let sourceLine = edges.find((item: any) => item.targetNodeId == node.id);
  //连出去的线
  let targetLine = edges.find((item: any) => item.sourceNodeId == node.id);

  let parent = nodes.find((item: any) => item.id == sourceLine?.sourceNodeId);
  if (parent?.type == 'task') {
    message.warning('最少存在一个子节点');
    return;
  }

  lf.deleteNode(node.id);
  lf.deleteEdge(sourceLine?.id);
  if (targetLine) {
    lf.deleteEdge(targetLine?.id);
    lf.addEdge({
      sourceNodeId: sourceLine?.sourceNodeId,
      targetNodeId: targetLine?.targetNodeId,
      startPoint: {
        ...sourceLine?.startPoint,
      },
      endPoint: {
        ...targetLine?.endPoint,
      },
      type: 'polyline',
    });
  }

  // lf.updateEdges(sourceLine.id, { targetNodeId: targetLine.targetNodeId })
};

const deleteTask = (lf: any, node: any, scheme?: any) => {
  //删除任务 找到子集递归
  const { nodes, edges } = lf.graphModel;
  console.log(edges);

  if (!scheme) {
    let parent = nodes?.find((item: any) => item.type == 'course');
    let parentLine = edges.filter((item: any) => item?.sourceNodeId == parent?.id);
    if (parentLine?.length == 1) {
      message.warning('至少存在一个任务节点');
      return;
    }
  }

  let childNodeId = edges.find?.((item: any) => item?.sourceNodeId == node.id)?.targetNodeId;
  lf.deleteNode(node.id);
  if (!childNodeId) {
    return;
  }
  let childNode = nodes?.find((n: any) => n.id == childNodeId);
  console.log(childNode);
  deleteTask(lf, childNode, true);
};
