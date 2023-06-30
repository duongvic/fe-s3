import { Anchor } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import './style.less';
const { Link } = Anchor;

const linkArray = {
  1: ['1.1', '1.2', '1.2.SUB_TITLE'],
  2: ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7'],
  3: ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7'],
};

export default function Sidebar() {
  const { t } = useTranslation('docs');

  const renderLink = (item: string, child?) => (
    <Link
      href={`#${item}`}
      className="bar"
      title={t(item.replaceAll('.', ' '))}
      key={item}
    >
      {child}
    </Link>
  );

  return (
    <div className="docs-sider-bar">
      <Anchor offsetTop={60}>
        {Object.keys(linkArray).map(item =>
          renderLink(
            String(item),
            linkArray[item].map(child => renderLink(child)),
          ),
        )}
      </Anchor>
    </div>
  );
}
