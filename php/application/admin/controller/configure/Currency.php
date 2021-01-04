<?php
namespace app\admin\controller\configure;
vendor('Qiniu.autoload');
use think\Db;
use think\Request;
use think\Config;
use Qiniu\Auth;
use Qiniu\Storage\UploadManager;

class Currency
{


   public function qiniu()
    {
        $accessKey = Config('qiniuaccessKey');
        $secretKey = Config('qiniusecretKey');
        $auth = new Auth($accessKey, $secretKey);
        $bucket = 'wxarticles';
        // 生成上传Token
        $upToken  = $auth->uploadToken($bucket);
        $ret = array('message' => "生成七牛上传Token成功",'uptoken' => $upToken);
        return $ret;
     }

  
}
