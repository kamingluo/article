<?php
namespace app\miniapp\controller;
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

        // Vendor('phpmailer.phpmailer'); 
        $accessKey = Config('qiniuaccessKey');
        $secretKey = Config('qiniusecretKey');
          $auth = new Auth($accessKey, $secretKey);
          $bucket = 'group';
          // 生成上传Token
         $upToken  = $auth->uploadToken($bucket);
        // return  $upToken;
         $ret = array('message' => "生成七牛上传Token成功",'uptoken' => $upToken);
         return $ret;
     }

     public function qiniumaterial()
    {

        $accessKey = Config('qiniuaccessKey');
        $secretKey = Config('qiniusecretKey');
        $auth = new Auth($accessKey, $secretKey);
        $bucket = 'material';
          // 生成上传Token
        $upToken  = $auth->uploadToken($bucket);
        // return  $upToken;
         $ret = array('message' => "生成material七牛上传Token成功",'uptoken' => $upToken);
         return $ret;
     }

    public function qiniugroupchatdata()
     {
 
         $accessKey = Config('qiniuaccessKey');
         $secretKey = Config('qiniusecretKey');
         $auth = new Auth($accessKey, $secretKey);
         $bucket = 'groupchatdata';
           // 生成上传Token
         $upToken  = $auth->uploadToken($bucket);
         // return  $upToken;
          $ret = array('message' => "生成七牛groupchatdata空间上传Token成功",'uptoken' => $upToken);
          return $ret;
      }



}
