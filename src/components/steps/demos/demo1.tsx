import { Steps } from 'antd-mobile'
import { DemoBlock } from 'demos'
import React from 'react'

const { Step } = Steps

export default () => {
  const [current, setCurrent] = React.useState(0)
  return (
    <>
      <DemoBlock title='Horizontal Steps'>
        <Steps current={current} onStepSelect={setCurrent} selectable>
          <Step title='标题1' description='描述' />
          <Step title='标题2' description='描述' />
          <Step title='标题3' description='描述' />
        </Steps>
      </DemoBlock>

      <DemoBlock title='横向步骤条失败'>
        <Steps current={2}>
          <Step title='第一步' />
          <Step title='第二步' />
          <Step title='第三步' status='error' />
          <Step title='第四步' />
        </Steps>
      </DemoBlock>

      <DemoBlock title='纵向步骤条'>
        <Steps direction='vertical'>
          <Step title='填写机构信息' status='process' />
          <Step title='签约机构' status='wait' />
          <Step title='关联服务区' status='wait' />
        </Steps>
      </DemoBlock>

      <DemoBlock title='纵向步骤条失败'>
        <Steps direction='vertical'>
          <Step
            title='填写机构信息'
            status='finish'
            description='完成时间：2020-12-01 12:30'
          />
          <Step
            title='签约机构'
            status='finish'
            description='完成时间：2020-12-01 12:30'
          />
          <Step
            title='关联服务区'
            status='finish'
            description='完成时间：2020-12-01 12:30'
          />
          <Step title='审批失败' status='error' />
        </Steps>
      </DemoBlock>
    </>
  )
}
