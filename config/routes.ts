console.log(process.env.UMI_ENV);
//  按钮权限以 _btn 结尾
export default [
  {
    path: '/',
    component: './home',
    name: '首页',
    layout: true,
    hideInMenu: true,
  },
  // -----导师端
  {
    path: '/front/teacher/teacher-home',
    component: './teacher-web/teacher-home',
    name: '首页',
    layout: true,
    access: 'routerAuth',
    role: ['admin', 'teacher'],
  },
  {
    path: '/front/teacher/course',
    component: './teacher-web/course/home',
    name: '课程管理',
    layout: true,
    access: 'routerAuth',
    role: ['admin', 'teacher'],
    routes: [
      {
        path: '/front/teacher/course/tablepage',
        component: './teacher-web/course',
        name: '课程管理',
        hideInMenu: true,
      },
      {
        path: '/front/teacher/course/draw',
        component: './teacher-web/course/teacher-draw',
        name: '课程流程',
        hideInMenu: true,
      },
      // 题干列表;
      {
        path: '/front/teacher/course/question-list',
        component: './teacher-web/question-list',
        name: '题目列表',
        hideInMenu: true,
      },
      {
        path: '/front/teacher/course/audio-list',
        component: './teacher-web/audio-list',
        name: '主题列表',
        hideInMenu: true,
      },
      {
        path: '/front/teacher/course/audio-detail',
        component: './teacher-web/audio-list/detail-page',
        name: '录音详情',
        hideInMenu: true,
      },
      {
        path: '/front/teacher/course/video-list',
        component: './teacher-web/video-list',
        name: '主题列表',
        hideInMenu: true,
      },
      {
        path: '/front/teacher/course/video-detail',
        component: './teacher-web/video-list/detail-page',
        name: '视频详情',
        hideInMenu: true,
      },
      {
        redirect: '/front/teacher/course/tablepage',
      },
    ],
    btnMenu: [
      {
        title: '新增',
        key: 'teacher_course_add_btn',
      },
      {
        title: '课程复制',
        key: 'teacher_course_copy_btn',
      },
      {
        title: '信息编辑',
        key: 'teacher_course_infoEdit_btn',
      },
      {
        title: '流程编辑',
        key: 'teacher_course_processEdit_btn',
      },
      {
        title: '发布',
        key: 'teacher_course_publish_btn',
      },
      {
        title: '下线',
        key: 'teacher_course_down_btn',
      },
      {
        title: '删除',
        key: 'teacher_course_delete_btn',
      },
      // 文本考试相关;
      {
        title: '新建题目',
        key: 'teacher_course_question_add_btn',
      },
      {
        title: '分数设置',
        key: 'teacher_course_score_set_btn',
      },
      {
        title: '删除题目',
        key: 'teacher_course_question_delete_btn',
      },
      {
        title: '编辑题目',
        key: 'teacher_course_question_edit_btn',
      },
    ],
  },
  {
    path: '/front/teacher/task',
    component: './teacher-web/task/home',
    name: '任务管理',
    access: 'routerAuth',
    role: ['admin', 'teacher'],
    layout: true,
    routes: [
      {
        path: '/front/teacher/task/tablepage',
        component: './teacher-web/task',
        name: '任务管理',
        hideInMenu: true,
      },
      {
        path: '/front/teacher/task/draw',
        component: './teacher-web/task/task-draw',
        name: '任务流程',
        hideInMenu: true,
      },
      {
        redirect: '/front/teacher/task/tablepage',
      },
    ],
    btnMenu: [
      {
        title: '新增',
        key: 'teacher_task_add_btn',
      },
      {
        title: '编辑',
        key: 'teacher_task_edit_btn',
      },
      {
        title: '流程编辑',
        key: 'teacher_task_processEdit_btn',
      },
      {
        title: '删除',
        key: 'teacher_task_delete_btn',
      },
    ],
  },
  {
    path: '/front/teacher/dataManage',
    component: './teacher-web/data-manage/home',
    name: '数据管理',
    access: 'routerAuth',
    role: ['admin', 'teacher'],
    layout: true,
    routes: [
      {
        path: '/front/teacher/dataManage/tablepage',
        component: './teacher-web/data-manage',
        name: '数据管理',
        hideInMenu: true,
      },
      {
        path: '/front/teacher/dataManage/detailData',
        component: './teacher-web/data-manage/detailData',
        name: '详细数据',
        hideInMenu: true,
      },
      {
        path: '/front/teacher/dataManage/courseDetails',
        component: './teacher-web/data-manage/courseDetails',
        name: '课程详情',
        hideInMenu: true,
      },
      {
        redirect: '/front/teacher/dataManage/tablepage',
      },
    ],
    btnMenu: [
      {
        title: '任务管理',
        key: 'teacher_dataManage_task_btn',
      },
      {
        title: '学员数据',
        key: 'teacher_dataManage_student_btn',
      },
      {
        title: '学员数据-导出',
        key: 'teacher_dataManage_student_exp_btn',
      },
      {
        title: '签到数据',
        key: 'teacher_dataManage_sign_btn',
      },
      {
        title: '签到数据-导出',
        key: 'teacher_dataManage_sign_exp_btn',
      },
      {
        title: '签到数据-删除',
        key: 'teacher_dataManage_sign_delete_btn',
      },
    ],
  },
  //-------导师端
  {
    path: '/front/teacher/paramsManage',
    component: './teacher-web/params-manage/home',
    name: '参数管理',
    access: 'routerAuth',
    role: ['admin', 'teacher'],
    layout: true,
    routes: [
      {
        path: '/front/teacher/paramsManage/userManage',
        component: './teacher-web/params-manage/user-manage',
        name: '用户管理',
        access: 'routerAuth',
        btnMenu: [
          {
            title: '用户管理',
            key: 'paramsManage_userManage_user_btn',
            children: [
              {
                title: '同步',
                key: 'paramsManage_userManage_user_sameStep_btn',
              },
              {
                title: '编辑',
                key: 'paramsManage_userManage_user_edit_btn',
              },
            ],
          },
          {
            title: '组别管理',
            key: 'paramsManage_userManage_rule_btn',
            children: [
              {
                title: '新增',
                key: 'paramsManage_userManage_rule_add_btn',
              },
              {
                title: '编辑',
                key: 'paramsManage_userManage_rule_edit_btn',
              },
              {
                title: '删除',
                key: 'paramsManage_userManage_rule_delete_btn',
              },
            ],
          },
          {
            title: '职场管理',
            key: 'paramsManage_userManage_workplace_btn',
            children: [
              {
                title: '新增',
                key: 'paramsManage_userManage_workplace_add_btn',
              },
              {
                title: '编辑',
                key: 'paramsManage_userManage_workplace_edit_btn',
              },
              {
                title: '删除',
                key: 'paramsManage_userManage_workplace_delete_btn',
              },
            ],
          },
          {
            title: '角色管理',
            key: 'paramsManage_userManage_role_btn',
            children: [
              {
                title: '同步',
                key: 'paramsManage_userManage_role_sameStep_btn',
              },
              {
                title: '编辑',
                key: 'paramsManage_userManage_role_edit_btn',
              },
            ],
          },
        ],
      },
      {
        path: '/front/teacher/paramsManage/ruleManage',
        component: './teacher-web/params-manage/rule-manage',
        name: '规则管理',
        access: 'routerAuth',
        role: ['admin'],
        btnMenu: [
          {
            title: '评分比例配置',
            key: 'paramsManage_ruleManage_score_btn',
          },
          {
            title: '服务规则配置',
            key: 'paramsManage_ruleManage_service_btn',
          },
          {
            title: '话术合格配置',
            key: 'paramsManage_ruleManage_dialogCom_btn',
          },
          {
            title: '沉默时间配置',
            key: 'paramsManage_ruleManage_timeConfig_btn',
          },
        ],
      },
      {
        path: '/front/teacher/paramsManage/modelPlotManage',
        component: './teacher-web/params-manage/model-plot-manage',
        name: '大模型剧情管理',
        access: 'routerAuth',
        btnMenu: [
          {
            title: '新增',
            key: 'paramsManage_modelPlotManage_add_btn',
          },
          {
            title: '编辑',
            key: 'paramsManage_modelPlotManage_edit_btn',
          },
          {
            title: '删除',
            key: 'paramsManage_modelPlotManage_delete_btn',
          },
        ],
      },
      {
        path: '/front/teacher/paramsManage/profileManage',
        component: './teacher-web/params-manage/profile-manage',
        name: '客户画像管理',
        access: 'routerAuth',
        btnMenu: [
          {
            title: '新增',
            key: 'paramsManage_profileManage_add_btn',
          },
          {
            title: '编辑',
            key: 'paramsManage_profileManage_edit_btn',
          },
          {
            title: '删除',
            key: 'paramsManage_profileManage_delete_btn',
          },
        ],
      },
      {
        path: '/front/teacher/paramsManage/soundConfigManage',
        component: './teacher-web/params-manage/sound-config-manage',
        name: '音色配置管理',
        access: 'routerAuth',
        btnMenu: [
          {
            title: '新增',
            key: 'paramsManage_soundConfigManage_add_btn',
          },
          {
            title: '编辑',
            key: 'paramsManage_soundConfigManage_edit_btn',
          },
          {
            title: '删除',
            key: 'paramsManage_soundConfigManage_delete_btn',
          },
        ],
      },
      {
        path: '/front/teacher/paramsManage/systemManage',
        component: './teacher-web/params-manage/system-manage',
        name: '系统管理',
        access: 'routerAuth',
        btnMenu: [
          {
            title: '新增',
            key: 'paramsManage_systemManage_add_btn',
          },
          {
            title: '编辑',
            key: 'paramsManage_systemManage_edit_btn',
          },
          {
            title: '删除',
            key: 'paramsManage_systemManage_delete_btn',
          },
          {
            title: '意图',
            key: 'paramsManage_systemManage_intention_btn',
          },
        ],
      },
      {
        path: '/front/teacher/paramsManage/intention',
        component: './teacher-web/params-manage/intention',
        name: '意图管理',
        access: 'routerAuth',
        hideInMenu: true,
        btnMenu: [
          {
            title: '新增',
            key: 'paramsManage_intention_add_btn',
          },
          {
            title: '编辑',
            key: 'paramsManage_intention_edit_btn',
          },
          {
            title: '删除',
            key: 'paramsManage_intention_delete_btn',
          },
          {
            title: '同步',
            key: 'paramsManage_intention_sameStep_btn',
          },
        ],
      },
      {
        path: '/front/teacher/paramsManage/tipsManage',
        component: './teacher-web/params-manage/tips-manage',
        name: '提示管理',
        access: 'routerAuth',
        btnMenu: [
          {
            title: '新建',
            key: 'paramsManage_tipsManage_add_btn',
          },
          {
            title: '查看',
            key: 'paramsManage_tipsManage_detail_btn',
          },
          {
            title: '编辑',
            key: 'paramsManage_tipsManage_edit_btn',
          },
          {
            title: '删除',
            key: 'paramsManage_tipsManage_delete_btn',
          },
        ],
      },
    ],
  },
  {
    path: '/front/teacher/knowledgeBaseManage',
    component: './teacher-web/knowledge-base-manage/home',
    name: '知识库管理',
    access: 'routerAuth',
    role: ['admin', 'teacher'],
    layout: true,
    routes: [
      {
        path: '/front/teacher/knowledgeBaseManage/knowledgeManage',
        component: './teacher-web/knowledge-base-manage/knowledge-manage',
        name: '知识管理',
        access: 'routerAuth',
        btnMenu: [
          {
            title: '新建',
            key: 'knowledge_manage_create_btn',
          },
          {
            title: '编辑',
            key: 'knowledge_manage_edit_btn',
          },
          {
            title: '删除',
            key: 'knowledge_manage_delete_btn',
          },
          {
            title: '上架',
            key: 'knowledge_manage_up_btn',
          },
          {
            title: '下架',
            key: 'knowledge_manage_down_btn',
          },
          {
            title: '查看',
            key: 'knowledge_manage_view_btn',
          },
        ],
      },
      {
        path: '/front/teacher/knowledgeBaseManage/knowledgeDetail',
        component: './teacher-web/knowledge-base-manage/knowledge-detail',
        name: '知识查看',
        access: 'routerAuth',
        btnMenu: [
          {
            title: '添加子文件夹',
            key: 'add_sub_directory_btn',
          },
          {
            title: '添加知识',
            key: 'add_knowledge_btn',
          },
          {
            title: '重命名',
            key: 'rename_directory_btn',
          },
          {
            title: '删除',
            key: 'delete_directory_btn',
          },
          {
            title: '下架',
            key: 'down_knowledge_btn',
          },
          {
            title: '拖拽',
            key: 'move_knowledge_btn',
          },
        ],
      },
      {
        path: '/front/teacher/knowledgeBaseManage/knowledgeQuality',
        component: './teacher-web/knowledge-base-manage/knowledge-quality',
        name: '品质知识库',
        access: 'routerAuth',
      },
      {
        path: '/front/teacher/knowledgeBaseManage/knowledgeDetail2',
        component: './teacher-web/knowledge-base-manage/knowledge-detail/rightside',
        name: '知识查看',
        roleName: '知识查看-没有知识目录',
        access: 'routerAuth',
        hideInMenu: true,
      },
    ],
  },
  // -----学员端
  // {
  //   path: '/student/personalInfo',
  //   component: './student-web/personal-info',
  //   name: '学生端-首页',
  //   layout: true,
  // },
  {
    path: '/front/student/student-home',
    component: './student-web/student-home',
    name: '首页',
    layout: true,
    access: 'routerAuth',
    role: ['admin', 'student'],
  },
  {
    path: '/front/student/course',
    component: './student-web/course',
    name: '学习课程',
    access: 'routerAuth',
    role: ['admin', 'student'],
    layout: true,
    btnMenu: [
      {
        title: '文本交卷',
        key: 'submit_answer_btn',
      },
    ],
  },
  // 文本考试;
  {
    path: '/front/student/course/question-list',
    component: './student-web/question-list',
    name: '课程管理',
    hideInMenu: true,
  },
  {
    path: '/front/student/course/detail',
    component: './student-web/detail',
    name: '课程详情',
    hideInMenu: true,
    layout: true,
  },
  {
    path: '/front/student/learnRecord',
    component: './student-web/learn-record',
    name: '学习记录',
    access: 'routerAuth',
    role: ['admin', 'student'],
    layout: true,
  },
  // 共享管理
  {
    path: '/front/teacher/share-manage',
    component: './teacher-web/share-manage/home',
    name: '共享管理',
    layout: true,
    access: 'routerAuth',
    role: ['admin', 'teacher'],
    routes: [
      {
        path: '/front/teacher/share-manage/index',
        component: './teacher-web/share-manage',
        name: '共享管理',
        hideInMenu: true,
      },
      {
        path: '/front/teacher/share-manage/video-detail',
        component: './teacher-web/video-list/detail-page',
        name: '视频详情',
        hideInMenu: true,
      },
      {
        redirect: '/front/teacher/share-manage/index',
      },
    ],
    btnMenu: [],
  },
  // 知识查看-学员
  {
    path: '/front/student/knowledgeBaseManage/knowledgeDetailStudent',
    component: './teacher-web/knowledge-base-manage/knowledge-detail',
    name: '知识查看',
    roleName: '学员端-知识查看',
    access: 'routerAuth',
    role: ['admin', 'student'],
    layout: true,
  },
  // {
  //   path: '/front/demo',
  //   component: './demo',
  //   name: '语音聊天demo测试',
  //   access: 'routerAuth',
  //   role: ['admin'],
  //   layout: true,
  // },
  // {
  //   path: '/front/drawdemo',
  //   component: './draw-demo',
  //   name: '画布demo测试',
  //   access: 'routerAuth',
  //   role: ['admin'],
  //   layout: true,
  // },
  // {
  //   path: '/front/drawdemo2',
  //   component: './teacher-web/task/task-draw',
  //   name: '任务画布demo测试',
  //   access: 'routerAuth',
  //   role: ['admin'],
  //   layout: true,
  // },
  {
    path: '/front/student/chat',
    component: './chat-page',
    name: '聊天窗口',
    access: 'routerAuth',
    role: ['admin', 'student'],
    hideInMenu: true,
    layout: true,
  },
  {
    path: '/front/student/model',
    component: './model-page',
    name: '聊天窗口',
    access: 'routerAuth',
    role: ['admin', 'student'],
    hideInMenu: true,
    layout: true,
  },
  {
    path: '/front/student/video-detail',
    component: './teacher-web/video-list/detail-page',
    name: '视频考试',
    access: 'routerAuth',
    role: ['admin', 'student'],
    hideInMenu: true,
  },
  {
    path: '/front/student/video-list',
    component: './student-web/video-list',
    name: '视频考试列表',
    access: 'routerAuth',
    role: ['admin', 'student'],
    hideInMenu: true,
  },
  {
    path: '/login',
    layout: false,
    hideInMenu: true,
    name: '登录',
    component: './user/Login',
    noAuth: true,
  },
  { path: '/403', component: './403', layout: true, hideInMenu: true },
  { component: './404', layout: true, hideInMenu: true },
];
